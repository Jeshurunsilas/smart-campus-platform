# Database Migration Execution Instructions

Follow these steps to initialize your Supabase PostgreSQL database and configure Row Level Security (RLS) for the Smart Campus Platform:

## Step-by-Step Migration Guide

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your target project.
3. In the left navigation menu, click on **SQL Editor**.
4. Execute the SQL migration files in numerical order:

### Migration 1: Initial Schema
- Copy all contents of [`01_initial_schema.sql`](./01_initial_schema.sql).
- Paste into a new query tab in the Supabase SQL Editor.
- Click **Run** (or `Ctrl+Enter`).
- **Verifies:** Creates all 10 core tables (`profiles`, `departments`, `service_categories`, `locations`, `service_requests`, `request_assignments`, `request_updates`, `notifications`, `announcements`, `feedback`), sequences, request number generator, and the automatic profile creation trigger for `auth.users`.

### Migration 2: Row Level Security (RLS) Policies
- Copy all contents of [`02_row_level_security.sql`](./02_row_level_security.sql).
- Paste into a new query tab in the SQL Editor.
- Click **Run**.
- **Verifies:** Enables RLS across all tables and applies security policies ensuring students, faculty, staff, and administrators can only access their authorized records.

### Migration 3: Storage & Seed Data
- Copy all contents of [`03_storage_and_seed_data.sql`](./03_storage_and_seed_data.sql).
- Paste into a new query tab in the SQL Editor.
- Click **Run**.
- **Verifies:** Configures the `service-request-images` storage bucket, storage upload security policies, and populates initial departments, categories, and campus locations with QR tokens.

---

## Administrator Provisioning

To grant an initial account the **administrator** role:
1. Register your account through the application UI or Supabase Auth dashboard.
2. In the Supabase SQL Editor, run:
   ```sql
   UPDATE public.profiles
   SET role = 'administrator', approval_status = 'approved'
   WHERE email = 'your-admin-email@campus.edu';
   ```
This avoids hardcoded passwords in source code while providing a secure, documented administrative setup.
