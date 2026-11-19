# Production Deployment Guide

## 1. Production Deployment Targets

The Smart Campus Platform supports multiple deployment environments:
1. **Vercel Global Edge Network** (Recommended for Serverless)
2. **Docker / Containerized Self-Hosted** (Recommended for Enterprise On-Premises)
3. **Kubernetes (Helm / K8s Manifests)**

---

## 2. Deploying to Vercel

1. **Import Repository:**
   Connect your GitHub repository to the Vercel Dashboard.

2. **Configure Environment Variables:**
   Add the following variables in **Project Settings → Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://fnpkjczdfikachurbsgb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Deploy:**
   Vercel will detect Next.js App Router and automatically execute `npm run build` using `vercel.json` settings.

---

## 3. Deploying with Docker & Docker Compose

1. **Verify Docker Installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Configure Environment:**
   Create `.env` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://fnpkjczdfikachurbsgb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Launch Containers:**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify Container Health:**
   ```bash
   docker ps
   # Container 'smart-campus-web' should report 'healthy'
   ```

---

## 4. Supabase Database Migration Checklist

Before directing production traffic, execute the 4 migration scripts in sequence using the **Supabase Dashboard SQL Editor**:
1. `database/migrations/01_initial_schema.sql` (Creates 10 tables, sequences, and relationships)
2. `database/migrations/02_row_level_security.sql` (Applies role-based RLS policies)
3. `database/migrations/03_storage_and_seed_data.sql` (Provisions `service-request-images` bucket and baseline campus data)
4. `database/migrations/04_smart_features_and_escalation.sql` (Creates escalation audit tables and auto-SLA triggers)
