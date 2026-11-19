import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Wrench,
  QrCode,
  Sparkles,
  BarChart3,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const portalRoles = [
    {
      title: "Student Portal",
      description:
        "Submit maintenance requests, scan classroom QR codes, track resolution in real-time, and rate services.",
      href: "/student",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      badge: "Student Access",
    },
    {
      title: "Faculty Portal",
      description:
        "Report laboratory equipment malfunctions, classroom AV/IT issues, and emergency electrical/network tickets.",
      href: "/faculty",
      icon: Briefcase,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badge: "Faculty Access",
    },
    {
      title: "Staff Dispatch",
      description:
        "Accept field assignments, capture resolution proof photos, provide internal notes, and complete work orders.",
      href: "/department",
      icon: Wrench,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      badge: "Staff Access",
    },
    {
      title: "Administrator HQ",
      description:
        "Approve new registrations, oversee SLA compliance, manage departments, and review campus performance analytics.",
      href: "/admin",
      icon: ShieldAlert,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      badge: "Admin Access",
    },
  ];

  const smartFeatures = [
    {
      icon: QrCode,
      title: "QR Campus Reporting",
      description: "Instant location detection across labs, classrooms, and halls.",
    },
    {
      icon: Sparkles,
      title: "Smart Priority Engine",
      description: "AI-assisted severity calculation and priority assignment.",
    },
    {
      icon: Clock,
      title: "Live SLA Monitoring",
      description: "Proactive countdowns and automated administrative escalation.",
    },
    {
      icon: BarChart3,
      title: "Executive Scorecards",
      description: "Department response analytics and satisfaction telemetry.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              SC
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                SmartCampus
              </span>
              <span className="text-xs text-teal-700 font-medium">Service Operations Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register/student"
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
            >
              Register Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Enterprise Service Management System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Integrated Smart Campus &amp; Service Request Management
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Centralizing university operational workflows across Students, Faculty, Administrators,
            and Department Field Staff with automated tracking, intelligent SLA monitoring, and real-time analytics.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md transition-all"
            >
              Access Campus Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register/student"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium border border-slate-200 shadow-sm transition-all"
            >
              Student Registration
            </Link>
            <Link
              href="/register/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium border border-slate-200 shadow-sm transition-all"
            >
              Faculty Registration
            </Link>
          </div>
        </section>

        {/* Four Distinct Roles Section */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Four Specialized Role Portals
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                Strict role-based isolation and dedicated workflows tailored to each stakeholder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portalRoles.map((portal) => {
                const IconComponent = portal.icon;
                return (
                  <div
                    key={portal.title}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl border ${portal.color} flex items-center justify-center`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-700">
                          {portal.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{portal.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200/80">
                      <Link
                        href={portal.href}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
                      >
                        Enter Portal
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Smart Engineering Features */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Architected for Real Campus Workloads
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Beyond simple CRUD — automated smart workflows that streamline operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {smartFeatures.map((feat) => {
              const FeatIcon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-teal-500/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
                    <FeatIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{feat.title}</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">Phase 1 Infrastructure Ready</h3>
              <p className="text-sm text-slate-300 mt-1">
                Next.js App Router, TypeScript, Tailwind CSS, Supabase SSR, Vitest, Playwright, and Zod validation schemas.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Build Verified
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Integrated Smart Campus &amp; Service Request Management Platform.
        </p>
        <p className="mt-1">
          Designed and built for University Operations &amp; Academic Software Engineering Demonstration.
        </p>
      </footer>
    </div>
  );
}
