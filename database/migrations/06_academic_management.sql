-- ==============================================================================
-- MIGRATION 06: ACADEMIC MANAGEMENT & UNIVERSITY EVALUATION SYSTEM
-- Additive Migration - Integrated with existing profiles, roles, and storage
-- ==============================================================================

-- 1. Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label VARCHAR(50) NOT NULL UNIQUE, -- e.g. "2025-2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Academic Semesters
CREATE TABLE IF NOT EXISTS academic_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_code VARCHAR(50) NOT NULL, -- e.g. "Fall 2025", "Spring 2026"
    semester_type VARCHAR(20) NOT NULL, -- 'odd', 'even', 'summer'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    registration_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (academic_year_id, semester_code)
);

-- 3. Academic Programmes
CREATE TABLE IF NOT EXISTS academic_programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. "BTECH-CSE", "MTECH-AI", "BBA"
    degree_type VARCHAR(50) NOT NULL DEFAULT 'Undergraduate', -- 'Undergraduate', 'Postgraduate', 'Doctoral'
    duration_years INTEGER NOT NULL DEFAULT 4,
    total_credits INTEGER NOT NULL DEFAULT 160,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Academic Courses
CREATE TABLE IF NOT EXISTS academic_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES academic_programmes(id) ON DELETE SET NULL,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    course_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. "CS301", "EC204"
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    lecture_hours INTEGER NOT NULL DEFAULT 3,
    lab_hours INTEGER NOT NULL DEFAULT 0,
    prerequisites TEXT[] DEFAULT '{}',
    max_enrolment_capacity INTEGER NOT NULL DEFAULT 60,
    syllabus_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Course Sections
CREATE TABLE IF NOT EXISTS course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES academic_semesters(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL DEFAULT 'Section A',
    faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    room_id UUID REFERENCES campus_rooms(id) ON DELETE SET NULL,
    schedule_slots JSONB NOT NULL DEFAULT '[]', -- Array of { day: 'Monday', start_time: '09:00', end_time: '10:30' }
    max_seats INTEGER NOT NULL DEFAULT 60,
    enrolled_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, semester_id, section_name)
);

-- 6. Course Enrolments
CREATE TABLE IF NOT EXISTS course_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES academic_semesters(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'draft', 'pending', 'approved', 'rejected', 'waitlisted', 'cancelled', 'completed'
    rejection_reason TEXT,
    waitlist_position INTEGER,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ,
    final_grade VARCHAR(10),
    final_gpa_points NUMERIC(4, 2),
    UNIQUE(section_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_enrolment_student ON course_enrolments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrolment_section ON course_enrolments(section_id);

-- 7. Academic Assignments
CREATE TABLE IF NOT EXISTS academic_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    max_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.0,
    weightage_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.0,
    open_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    late_submission_allowed BOOLEAN DEFAULT TRUE,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_file_types TEXT[] DEFAULT '{"pdf", "zip", "docx", "py", "java"}',
    resubmission_allowed BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'published', -- 'draft', 'published', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES academic_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    file_url TEXT,
    file_name VARCHAR(255),
    submission_text TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_late BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted', -- 'submitted', 'under_evaluation', 'evaluated', 'returned_for_resubmission'
    marks_obtained NUMERIC(6, 2),
    faculty_feedback TEXT,
    evaluated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    evaluated_at TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id, version)
);

-- 9. Academic Examinations
CREATE TABLE IF NOT EXISTS academic_examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    exam_type VARCHAR(50) NOT NULL DEFAULT 'quiz', -- 'quiz', 'internal', 'midterm', 'practical', 'final'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 50.0,
    weightage_pct NUMERIC(5, 2) NOT NULL DEFAULT 25.0,
    is_randomized BOOLEAN DEFAULT FALSE,
    instructions TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'active', 'completed', 'published'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Examination Questions
CREATE TABLE IF NOT EXISTS examination_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES academic_examinations(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_type VARCHAR(30) NOT NULL DEFAULT 'mcq', -- 'mcq', 'true_false', 'short_answer', 'descriptive'
    question_text TEXT NOT NULL,
    options JSONB, -- Array of { id: 'A', text: 'Option A' }
    correct_answer TEXT, -- Evaluated server-side only
    marks NUMERIC(5, 2) NOT NULL DEFAULT 2.0,
    rubric TEXT,
    UNIQUE(exam_id, question_number)
);

-- 11. Examination Attempts
CREATE TABLE IF NOT EXISTS examination_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES academic_examinations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    total_score NUMERIC(6, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'evaluated', 'timed_out'
    auto_evaluated BOOLEAN DEFAULT FALSE,
    UNIQUE(exam_id, student_id)
);

-- 12. Examination Answers
CREATE TABLE IF NOT EXISTS examination_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES examination_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES examination_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    marks_awarded NUMERIC(5, 2),
    is_correct BOOLEAN,
    faculty_remarks TEXT,
    UNIQUE(attempt_id, question_id)
);

-- 13. Academic Grade Records & Gradebook
CREATE TABLE IF NOT EXISTS academic_grade_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academic_courses(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES academic_semesters(id) ON DELETE CASCADE,
    component_name VARCHAR(100) NOT NULL, -- 'Internal Assessment', 'Assignments', 'Quizzes', 'Midterm', 'Practical', 'End Semester', 'Project'
    marks_obtained NUMERIC(6, 2) NOT NULL,
    max_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.0,
    weightage_pct NUMERIC(5, 2) NOT NULL DEFAULT 20.0,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, section_id, component_name)
);

-- 14. Grade Change Audits
CREATE TABLE IF NOT EXISTS grade_change_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_record_id UUID NOT NULL REFERENCES academic_grade_records(id) ON DELETE CASCADE,
    previous_marks NUMERIC(6, 2),
    new_marks NUMERIC(6, 2) NOT NULL,
    reason TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES profiles(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Capstone / Academic Projects
CREATE TABLE IF NOT EXISTS academic_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'capstone', -- 'capstone', 'research', 'industry', 'mini_project'
    programme_id UUID REFERENCES academic_programmes(id) ON DELETE SET NULL,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    guide_faculty_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'registered', -- 'registered', 'abstract_approved', 'first_review', 'second_review', 'final_evaluation', 'approved', 'revision_required', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Project Team Members
CREATE TABLE IF NOT EXISTS project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES academic_projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'member', -- 'team_lead', 'member'
    contribution_summary TEXT,
    UNIQUE(project_id, student_id)
);

-- 17. Project Reviews & Evaluation Rubrics
CREATE TABLE IF NOT EXISTS project_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES academic_projects(id) ON DELETE CASCADE,
    review_stage VARCHAR(50) NOT NULL, -- 'Abstract Review', 'First Review', 'Second Review', 'Final Evaluation'
    scheduled_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'deferred'
    panel_faculty_ids UUID[] DEFAULT '{}',
    total_score NUMERIC(5, 2),
    max_score NUMERIC(5, 2) DEFAULT 100.0,
    rubric_breakdown JSONB NOT NULL DEFAULT '{}', -- { problem_definition: 18, implementation: 28, innovation: 17, testing: 19, presentation: 10 }
    feedback_comments TEXT,
    recommendation VARCHAR(50) DEFAULT 'Proceed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, review_stage)
);

-- 18. Attendance Sessions & Records
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    room_id UUID REFERENCES campus_rooms(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    topic_covered VARCHAR(255),
    total_present INTEGER DEFAULT 0,
    total_absent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'present', -- 'present', 'absent', 'late', 'excused'
    notes TEXT,
    UNIQUE(session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR ACADEMIC MANAGEMENT
-- ==============================================================================
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_grade_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Catalogue & Sections: readable by all authenticated users
CREATE POLICY "Public read academic courses" ON academic_courses FOR SELECT USING (true);
CREATE POLICY "Public read programmes" ON academic_programmes FOR SELECT USING (true);
CREATE POLICY "Public read semesters" ON academic_semesters FOR SELECT USING (true);
CREATE POLICY "Public read years" ON academic_years FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON course_sections FOR SELECT USING (true);

-- Enrolments: Students can view their own enrolments; Faculty & Admin can view all
CREATE POLICY "Students view own enrolments" ON course_enrolments FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'faculty'))
);

-- Submissions: Students view own; Faculty of section and Admins view all
CREATE POLICY "Students view own submissions" ON assignment_submissions FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'faculty'))
);

-- Grades: Strict student privacy — students view only their own grades
CREATE POLICY "Students view own grades" ON academic_grade_records FOR SELECT USING (
    (student_id = auth.uid() AND is_published = true) OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'faculty'))
);

-- Attendance: Students view own attendance
CREATE POLICY "Students view own attendance" ON attendance_records FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'faculty'))
);
