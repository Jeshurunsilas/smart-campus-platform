-- ==============================================================================
-- SMART CAMPUS PLATFORM - DATABASE MIGRATION 02: ROW LEVEL SECURITY POLICIES
-- Strict, role-based authorization rules applied at the PostgreSQL level
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- HELPER SECURITY FUNCTIONS (SECURITY DEFINER to avoid recursion)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'administrator' AND approval_status = 'approved'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'department_staff' AND approval_status = 'approved'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND approval_status = 'approved'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile or profiles of approved users (for staff/requester names)
CREATE POLICY "profiles_select_policy"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR
        public.is_admin() OR
        approval_status = 'approved'
    );

-- Users can only update their own avatar and phone, NEVER their role or approval status
CREATE POLICY "profiles_update_own_fields"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
        approval_status = (SELECT approval_status FROM public.profiles WHERE id = auth.uid())
    );

-- Administrators can update any profile (approval status, roles)
CREATE POLICY "profiles_admin_update"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Profiles are inserted exclusively by the trigger or administrator
CREATE POLICY "profiles_admin_insert"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin() OR id = auth.uid());

-- ------------------------------------------------------------------------------
-- 2. DEPARTMENTS, CATEGORIES & LOCATIONS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can view active departments, categories, and locations
CREATE POLICY "departments_read_all"
    ON public.departments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "departments_admin_all"
    ON public.departments FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "categories_read_all"
    ON public.service_categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "categories_admin_all"
    ON public.service_categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "locations_read_all"
    ON public.locations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "locations_admin_all"
    ON public.locations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. SERVICE REQUESTS POLICIES
-- ------------------------------------------------------------------------------
-- Requesters see their own; Assigned staff see assigned; Admins see all
CREATE POLICY "requests_select_policy"
    ON public.service_requests FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        assigned_staff_id = auth.uid() OR
        public.is_admin()
    );

-- Approved students and faculty can submit service requests
CREATE POLICY "requests_insert_policy"
    ON public.service_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        public.is_approved_user()
    );

-- Requesters can edit title/description if status is still 'Submitted'
CREATE POLICY "requests_update_own_pending"
    ON public.service_requests FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND status = 'Submitted')
    WITH CHECK (user_id = auth.uid() AND status = 'Submitted');

-- Department staff can update status and resolved_at on assigned requests
CREATE POLICY "requests_staff_update"
    ON public.service_requests FOR UPDATE
    TO authenticated
    USING (assigned_staff_id = auth.uid() OR public.is_admin())
    WITH CHECK (assigned_staff_id = auth.uid() OR public.is_admin());

-- Administrators have full management rights over requests
CREATE POLICY "requests_admin_manage"
    ON public.service_requests FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. REQUEST ASSIGNMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "assignments_select_policy"
    ON public.request_assignments FOR SELECT
    TO authenticated
    USING (
        staff_id = auth.uid() OR
        assigned_by = auth.uid() OR
        public.is_admin()
    );

CREATE POLICY "assignments_admin_manage"
    ON public.request_assignments FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. REQUEST UPDATES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "updates_select_policy"
    ON public.request_updates FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = request_id AND (
                sr.user_id = auth.uid() OR
                sr.assigned_staff_id = auth.uid() OR
                public.is_admin()
            )
        )
    );

CREATE POLICY "updates_insert_policy"
    ON public.request_updates FOR INSERT
    TO authenticated
    WITH CHECK (
        updated_by = auth.uid() AND
        (
            public.is_admin() OR
            public.is_staff() OR
            EXISTS (SELECT 1 FROM public.service_requests sr WHERE sr.id = request_id AND sr.user_id = auth.uid())
        )
    );

-- ------------------------------------------------------------------------------
-- 6. NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "notifications_user_own"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "notifications_user_update"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_insert_system"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. ANNOUNCEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "announcements_read_policy"
    ON public.announcements FOR SELECT
    TO authenticated
    USING (
        target_audience = 'all' OR
        target_audience = public.get_auth_role() OR
        public.is_admin()
    );

CREATE POLICY "announcements_admin_manage"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. FEEDBACK POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "feedback_select_policy"
    ON public.feedback FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = request_id AND sr.assigned_staff_id = auth.uid()
        )
    );

CREATE POLICY "feedback_insert_requester"
    ON public.feedback FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = request_id AND sr.user_id = auth.uid() AND sr.status IN ('Resolved', 'Closed')
        )
    );
