-- ==============================================================================
-- MIGRATION 04: SMART CAMPUS FEATURES, SLA ENGINE & ESCALATIONS
-- ==============================================================================

-- 1. Create Escalation History Audit Table
CREATE TABLE IF NOT EXISTS public.escalation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    triggered_by TEXT NOT NULL DEFAULT 'system',
    escalated_to_role TEXT NOT NULL DEFAULT 'administrator',
    previous_priority TEXT,
    new_priority TEXT,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add Smart Campus Columns to service_requests if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_requests' AND column_name = 'sla_deadline'
    ) THEN
        ALTER TABLE public.service_requests ADD COLUMN sla_deadline TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_requests' AND column_name = 'is_overdue'
    ) THEN
        ALTER TABLE public.service_requests ADD COLUMN is_overdue BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_requests' AND column_name = 'suggested_priority'
    ) THEN
        ALTER TABLE public.service_requests ADD COLUMN suggested_priority TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_requests' AND column_name = 'priority_override_reason'
    ) THEN
        ALTER TABLE public.service_requests ADD COLUMN priority_override_reason TEXT;
    END IF;
END $$;

-- 3. High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_sla_deadline ON public.service_requests(sla_deadline);
CREATE INDEX IF NOT EXISTS idx_service_requests_is_overdue ON public.service_requests(is_overdue);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON public.service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_service_requests_location_id ON public.service_requests(location_id);
CREATE INDEX IF NOT EXISTS idx_escalation_history_request_id ON public.escalation_history(request_id);

-- 4. Enable Row Level Security (RLS) on escalation_history
ALTER TABLE public.escalation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administrators and Staff can view escalations"
    ON public.escalation_history
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('administrator', 'department_staff')
        )
    );

CREATE POLICY "System and Admins can insert escalations"
    ON public.escalation_history
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('administrator', 'department_staff')
        )
        OR auth.uid() IS NOT NULL
    );

-- 5. Helper Function for Automated SLA Target Calculation
CREATE OR REPLACE FUNCTION public.calculate_sla_target(priority_level TEXT)
RETURNS INTERVAL AS $$
BEGIN
    CASE priority_level
        WHEN 'Critical' THEN RETURN INTERVAL '4 hours';
        WHEN 'High'     THEN RETURN INTERVAL '12 hours';
        WHEN 'Medium'   THEN RETURN INTERVAL '24 hours';
        WHEN 'Low'      THEN RETURN INTERVAL '48 hours';
        ELSE RETURN INTERVAL '24 hours';
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Trigger to Set SLA Deadline Automatically on Insert
CREATE OR REPLACE FUNCTION public.set_service_request_sla()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sla_deadline IS NULL THEN
        NEW.sla_deadline := NEW.created_at + public.calculate_sla_target(NEW.priority::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_service_request_sla ON public.service_requests;
CREATE TRIGGER trg_set_service_request_sla
    BEFORE INSERT ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.set_service_request_sla();
