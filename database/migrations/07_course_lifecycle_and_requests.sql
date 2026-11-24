-- ==============================================================================
-- MIGRATION 07: COURSE LIFECYCLE, JOIN REQUESTS, AND COLLABORATION WORKFLOW
-- ==============================================================================

-- 1. Extend academic_courses with full lifecycle fields
ALTER TABLE academic_courses
    ADD COLUMN IF NOT EXISTS academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES academic_semesters(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS faculty_owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS course_category VARCHAR(50) DEFAULT 'Core',
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS end_date DATE,
    ADD COLUMN IF NOT EXISTS schedule_summary VARCHAR(255) DEFAULT 'Mon, Wed 10:00 - 11:30 AM',
    ADD COLUMN IF NOT EXISTS classroom_location VARCHAR(100) DEFAULT 'Academic Block 1 - Room 204',
    ADD COLUMN IF NOT EXISTS learning_objectives TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS course_image_url TEXT,
    ADD COLUMN IF NOT EXISTS allow_enrolment BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS allow_faculty_collaboration BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS enrolment_deadline TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'APPROVED',
    ADD COLUMN IF NOT EXISTS publication_status VARCHAR(50) DEFAULT 'PUBLISHED',
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS modification_notes TEXT,
    ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_academic_courses_faculty_owner ON academic_courses(faculty_owner_id);
CREATE INDEX IF NOT EXISTS idx_academic_courses_approval_status ON academic_courses(approval_status);
CREATE INDEX IF NOT EXISTS idx_academic_courses_publication_status ON academic_courses(publication_status);

-- 2. Course Enrolment & Faculty Collaboration Requests
CREATE TABLE IF NOT EXISTS course_enrolment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    section_id UUID REFERENCES course_sections(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    applicant_role VARCHAR(50) NOT NULL CHECK (applicant_role IN ('student', 'faculty')),
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('student_join', 'faculty_collaboration')),
    requested_role VARCHAR(50) NOT NULL CHECK (requested_role IN ('student', 'co_instructor', 'teaching_assistant', 'contributor')),
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED', 'CANCELLED')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_requests_course ON course_enrolment_requests(course_id);
CREATE INDEX IF NOT EXISTS idx_course_requests_applicant ON course_enrolment_requests(applicant_id);
CREATE INDEX IF NOT EXISTS idx_course_requests_status ON course_enrolment_requests(status);

-- Unique index to prevent duplicate pending requests from the same user for the same course and type
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_course_requests 
    ON course_enrolment_requests(course_id, applicant_id, request_type) 
    WHERE status = 'PENDING';

-- 3. Course Memberships (Role-Based Access for Students & Faculty Collaborators)
CREATE TABLE IF NOT EXISTS course_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    membership_role VARCHAR(50) NOT NULL CHECK (membership_role IN ('owner', 'co_instructor', 'teaching_assistant', 'contributor', 'student')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'dropped')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_course_memberships_course ON course_memberships(course_id);
CREATE INDEX IF NOT EXISTS idx_course_memberships_user ON course_memberships(user_id);

-- 4. Course Protected Learning Materials
CREATE TABLE IF NOT EXISTS course_learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL DEFAULT 'pdf',
    file_size_mb NUMERIC(6, 2) DEFAULT 0,
    uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_learning_materials(course_id);

-- 5. Atomic Seat Allocation & Request Approval Function (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION approve_course_join_request_tx(
    p_request_id UUID,
    p_reviewer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_req RECORD;
    v_course RECORD;
    v_section RECORD;
    v_membership_id UUID;
    v_enrolment_id UUID;
    v_current_count INTEGER;
BEGIN
    -- 1. Lock the request record
    SELECT * INTO v_req
    FROM course_enrolment_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Course request record not found.');
    END IF;

    IF v_req.status <> 'PENDING' AND v_req.status <> 'WAITLISTED' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Request is not in a pending state.');
    END IF;

    -- 2. Lock the course record
    SELECT * INTO v_course
    FROM academic_courses
    WHERE id = v_req.course_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Associated course not found.');
    END IF;

    -- 3. If student join request, enforce seat capacity atomically
    IF v_req.request_type = 'student_join' THEN
        SELECT COUNT(*) INTO v_current_count
        FROM course_memberships
        WHERE course_id = v_course.id AND membership_role = 'student' AND status = 'active';

        IF v_current_count >= v_course.max_enrolment_capacity THEN
            -- Place in waitlist instead
            UPDATE course_enrolment_requests
            SET status = 'WAITLISTED',
                updated_at = NOW()
            WHERE id = p_request_id;

            RETURN jsonb_build_object(
                'success', false,
                'status', 'WAITLISTED',
                'message', 'Course capacity reached. Request has been placed on the official waitlist.'
            );
        END IF;
    END IF;

    -- 4. Mark request approved
    UPDATE course_enrolment_requests
    SET status = 'APPROVED',
        reviewed_by = p_reviewer_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_request_id;

    -- 5. Insert or activate course membership
    INSERT INTO course_memberships (
        course_id,
        user_id,
        membership_role,
        status,
        approved_by,
        approved_at
    ) VALUES (
        v_req.course_id,
        v_req.applicant_id,
        v_req.requested_role,
        'active',
        p_reviewer_id,
        NOW()
    )
    ON CONFLICT (course_id, user_id)
    DO UPDATE SET
        membership_role = EXCLUDED.membership_role,
        status = 'active',
        approved_by = EXCLUDED.approved_by,
        approved_at = EXCLUDED.approved_at
    RETURNING id INTO v_membership_id;

    -- 6. If student, ensure linked course_enrolments row exists
    IF v_req.applicant_role = 'student' THEN
        -- Find primary section
        SELECT id INTO v_section FROM course_sections WHERE course_id = v_course.id LIMIT 1;

        IF v_section IS NOT NULL THEN
            UPDATE course_sections
            SET enrolled_count = enrolled_count + 1
            WHERE id = v_section.id;

            INSERT INTO course_enrolments (
                section_id,
                course_id,
                student_id,
                semester_id,
                status
            ) VALUES (
                v_section.id,
                v_course.id,
                v_req.applicant_id,
                COALESCE(v_course.semester_id, (SELECT id FROM academic_semesters WHERE is_current = TRUE LIMIT 1)),
                'approved'
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'membership_id', v_membership_id,
        'message', 'Request successfully approved and course membership granted.'
    );
END;
$$;

-- 6. Row-Level Security (RLS) Policies
ALTER TABLE course_enrolment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_learning_materials ENABLE ROW LEVEL SECURITY;

-- Enrolment Requests RLS
CREATE POLICY "Students can view their own course requests"
    ON course_enrolment_requests FOR SELECT
    TO authenticated
    USING (applicant_id = auth.uid());

CREATE POLICY "Students can create course requests"
    ON course_enrolment_requests FOR INSERT
    TO authenticated
    WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Course faculty and admins can view course requests"
    ON course_enrolment_requests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM academic_courses c
            WHERE c.id = course_enrolment_requests.course_id
            AND (c.faculty_owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'administrator'
            ))
        )
    );

CREATE POLICY "Course faculty and admins can update course requests"
    ON course_enrolment_requests FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM academic_courses c
            WHERE c.id = course_enrolment_requests.course_id
            AND (c.faculty_owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'administrator'
            ))
        )
    );

-- Memberships RLS
CREATE POLICY "Users can view memberships in courses they belong to or teach"
    ON course_memberships FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM academic_courses c
            WHERE c.id = course_memberships.course_id
            AND (c.faculty_owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'administrator'
            ))
        )
    );

-- Learning Materials RLS
CREATE POLICY "Enrolled students, collaborators, and admins can view course materials"
    ON course_learning_materials FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM course_memberships m
            WHERE m.course_id = course_learning_materials.course_id
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
        OR EXISTS (
            SELECT 1 FROM academic_courses c
            WHERE c.id = course_learning_materials.course_id
            AND c.faculty_owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'administrator'
        )
    );

CREATE POLICY "Faculty owner and co-instructors can manage course materials"
    ON course_learning_materials FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM academic_courses c
            WHERE c.id = course_learning_materials.course_id
            AND c.faculty_owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM course_memberships m
            WHERE m.course_id = course_learning_materials.course_id
            AND m.user_id = auth.uid()
            AND m.membership_role IN ('co_instructor', 'teaching_assistant')
            AND m.status = 'active'
        )
        OR EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'administrator'
        )
    );
