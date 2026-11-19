-- ==============================================================================
-- SMART CAMPUS PLATFORM - DATABASE MIGRATION 01: INITIAL SCHEMA
-- Tables: profiles, departments, service_categories, locations,
--         service_requests, request_assignments, request_updates,
--         notifications, announcements, feedback
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. DEPARTMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    department_head TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. SERVICE CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(department_id, name)
);

-- ------------------------------------------------------------------------------
-- 3. LOCATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_name TEXT NOT NULL,
    floor TEXT,
    room_number TEXT,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. PROFILES TABLE (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'administrator', 'department_staff')),
    registration_number TEXT,
    faculty_id TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. SERVICE REQUESTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    location_id UUID NOT NULL REFERENCES public.locations(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (
        status IN ('Submitted', 'Under Review', 'Assigned', 'Accepted', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Rejected')
    ),
    image_url TEXT,
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. REQUEST ASSIGNMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.profiles(id),
    assigned_by UUID NOT NULL REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. REQUEST UPDATES TABLE (Full Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    updated_by UUID NOT NULL REFERENCES public.profiles(id),
    old_status TEXT,
    new_status TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    related_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. ANNOUNCEMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (
        target_audience IN ('all', 'student', 'faculty', 'department_staff')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. FEEDBACK TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE REFERENCES public.service_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approval ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_dept ON public.profiles(department_id);

CREATE INDEX IF NOT EXISTS idx_requests_user ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_dept ON public.service_requests(department_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON public.service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_requests_staff ON public.service_requests(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_requests_number ON public.service_requests(request_number);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_updates_request ON public.request_updates(request_id);
CREATE INDEX IF NOT EXISTS idx_locations_qr ON public.locations(qr_code);

-- ------------------------------------------------------------------------------
-- AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_requests_modtime
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_announcements_modtime
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- AUTOMATIC REQUEST NUMBER GENERATOR
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.service_request_seq START WITH 1000;

CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := 'REQ-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.service_request_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_request_number
    BEFORE INSERT ON public.service_requests
    FOR EACH ROW EXECUTE FUNCTION public.generate_request_number();

-- ------------------------------------------------------------------------------
-- AUTH TRIGGER: POPULATE PROFILE ON USER SIGNUP
-- Automatically creates a pending profile for student/faculty registrations
-- Prevents self-elevation to administrator or staff
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    raw_role TEXT;
    assigned_role TEXT;
BEGIN
    raw_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    
    -- Security gate: Self-registration is restricted to student or faculty
    IF raw_role IN ('student', 'faculty') THEN
        assigned_role := raw_role;
    ELSE
        assigned_role := 'student';
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role,
        registration_number,
        faculty_id,
        department_id,
        approval_status,
        avatar_url
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        assigned_role,
        NEW.raw_user_meta_data->>'registration_number',
        NEW.raw_user_meta_data->>'faculty_id',
        NULLIF(NEW.raw_user_meta_data->>'department_id', '')::UUID,
        'pending', -- Requires administrator approval
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
