import {
  AcademicYear,
  AcademicSemester,
  AcademicProgramme,
  AcademicCourse,
  CourseSection,
  CourseEnrolment,
  AcademicAssignment,
  AssignmentSubmission,
  AcademicExamination,
  ExaminationAttempt,
  AcademicGradeRecord,
  AcademicProject,
  AttendanceSession,
  AttendanceRecord,
  EnrolmentStatus,
  CourseApprovalStatus,
  CoursePublicationStatus,
  CourseCategory,
  CourseRequestType,
  CourseRequestedRole,
  CourseRequestStatus,
  CourseMembershipRole,
  CourseMembershipStatus,
  CourseEnrolmentRequest,
  CourseMembership,
  CourseLearningMaterial,
} from "@/types";

// ==============================================================================
// DETERMINISTIC ACADEMIC DEMO DATA FIXTURES
// ==============================================================================

export const DEMO_ACADEMIC_YEARS: AcademicYear[] = [
  { id: "ay-2025-26", year_label: "2025-2026", start_date: "2025-08-01", end_date: "2026-06-30", is_current: true },
  { id: "ay-2024-25", year_label: "2024-2025", start_date: "2024-08-01", end_date: "2025-06-30", is_current: false },
];

export const DEMO_SEMESTERS: AcademicSemester[] = [
  {
    id: "sem-spring-2026",
    academic_year_id: "ay-2025-26",
    semester_code: "SP26",
    term: "Spring",
    start_date: "2026-01-05",
    end_date: "2026-05-20",
    is_active: true,
  },
  {
    id: "sem-autumn-2025",
    academic_year_id: "ay-2025-26",
    semester_code: "FA25",
    term: "Autumn",
    start_date: "2025-08-01",
    end_date: "2025-12-20",
    is_active: false,
  },
];

export const DEMO_PROGRAMMES: AcademicProgramme[] = [
  {
    id: "prg-btech-cse",
    programme_code: "BTECH-CSE",
    name: "B.Tech in Computer Science and Engineering",
    degree_level: "undergraduate",
    duration_years: 4,
    total_credits: 160,
  },
  {
    id: "prg-mtech-ai",
    programme_code: "MTECH-AI",
    name: "M.Tech in Artificial Intelligence & Robotics",
    degree_level: "postgraduate",
    duration_years: 2,
    total_credits: 72,
  },
  {
    id: "prg-btech-ece",
    programme_code: "BTECH-ECE",
    name: "B.Tech in Electronics & Communication",
    degree_level: "undergraduate",
    duration_years: 4,
    total_credits: 160,
  },
];

export const DEMO_COURSES: AcademicCourse[] = [
  {
    id: "crs-cs301",
    course_code: "CS301",
    title: "Operating Systems & Distributed Architecture",
    description: "Deep dive into kernel primitives, virtualization, IPC, concurrency protocols, distributed consensus algorithms (Raft/Paxos), and POSIX thread scheduling.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    faculty_owner_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    credits: 4,
    lecture_hours: 3,
    lab_hours: 2,
    tutorial_hours: 1,
    course_category: "Core",
    academic_year: "2025-2026",
    semester: "Semester 6",
    max_enrolment_capacity: 60,
    course_start_date: "2026-01-10",
    course_end_date: "2026-05-15",
    class_schedule: "Mon, Wed 10:00 - 11:30 AM",
    classroom_location: "Hall 304, Turing Wing",
    prerequisites: ["CS201", "CS204"],
    learning_objectives: [
      "Understand OS kernel architecture, virtual memory, and file systems",
      "Implement multi-threaded synchronization using semaphores and mutexes",
      "Analyze distributed consistency protocols including Raft",
      "Develop custom Linux loadable kernel modules (LKMs)",
    ],
    syllabus_url: "https://campus.edu/syllabi/CS301_Spring2026.pdf",
    course_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    allow_enrolment: true,
    allow_faculty_collaboration: true,
    enrolment_deadline: "2027-05-30",
    approval_status: "APPROVED",
    publication_status: "PUBLISHED",
    is_published: true,
    submitted_at: "2025-12-10T10:00:00Z",
    reviewed_at: "2025-12-15T14:30:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004", // Campus Admin
  },
  {
    id: "crs-cs302",
    course_code: "CS302",
    title: "Deep Learning & Neural Architectures",
    description: "Theoretical and applied foundations of backpropagation, Transformer models, diffusion systems, vision transformers, and hardware-accelerated tensor optimization.",
    department_id: "dept-cse",
    programme_id: "prg-mtech-ai",
    faculty_owner_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    credits: 4,
    lecture_hours: 3,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Elective",
    academic_year: "2025-2026",
    semester: "Semester 6",
    max_enrolment_capacity: 45,
    course_start_date: "2026-01-12",
    course_end_date: "2026-05-18",
    class_schedule: "Tue, Thu 02:00 - 03:30 PM",
    classroom_location: "AI Supercomputing Lab 102",
    prerequisites: ["CS203", "MATH201"],
    learning_objectives: [
      "Master gradient descent mechanics and automatic differentiation",
      "Build transformer attention mechanisms from scratch in PyTorch",
      "Deploy quantized model weights to edge tensor cores",
    ],
    syllabus_url: "https://campus.edu/syllabi/CS302_Spring2026.pdf",
    course_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    allow_enrolment: true,
    allow_faculty_collaboration: true,
    enrolment_deadline: "2027-05-30",
    approval_status: "APPROVED",
    publication_status: "PUBLISHED",
    is_published: true,
    submitted_at: "2025-12-12T11:00:00Z",
    reviewed_at: "2025-12-16T16:00:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004",
  },
  {
    id: "crs-cs303",
    course_code: "CS303",
    title: "Cloud Native Systems & Microservices",
    description: "Building scalable distributed services with Kubernetes, gRPC, service meshes, zero-trust service authentication, and event streams.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    faculty_owner_id: "usr-faculty-02", // Dr. Rajesh Kumar
    credits: 3,
    lecture_hours: 2,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Elective",
    academic_year: "2025-2026",
    semester: "Semester 6",
    max_enrolment_capacity: 50,
    course_start_date: "2026-01-15",
    course_end_date: "2026-05-20",
    class_schedule: "Fri 09:00 AM - 01:00 PM",
    classroom_location: "Cloud DevOps Sandbox 201",
    prerequisites: ["CS301"],
    learning_objectives: [
      "Orchestrate resilient multi-zone container topologies",
      "Design zero-loss asynchronous event streams using Kafka",
      "Implement circuit breakers and distributed tracing telemetry",
    ],
    syllabus_url: "https://campus.edu/syllabi/CS303_Spring2026.pdf",
    course_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    allow_enrolment: true,
    allow_faculty_collaboration: false,
    enrolment_deadline: "2027-05-30",
    approval_status: "APPROVED",
    publication_status: "PUBLISHED",
    is_published: true,
    submitted_at: "2025-12-14T09:00:00Z",
    reviewed_at: "2025-12-18T10:30:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004",
  },
  {
    id: "crs-ec305",
    course_code: "EC305",
    title: "Embedded IoT Architecture & RTOS",
    description: "Microcontroller architecture, real-time operating systems (FreeRTOS), hardware interrupts, sensor bus protocols (I2C, SPI), and low-power mesh networking.",
    department_id: "dept-ece",
    programme_id: "prg-btech-ece",
    faculty_owner_id: "usr-faculty-02", // Dr. Rajesh Kumar
    credits: 4,
    lecture_hours: 3,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Core",
    academic_year: "2025-2026",
    semester: "Semester 6",
    max_enrolment_capacity: 40,
    course_start_date: "2026-01-16",
    course_end_date: "2026-05-22",
    class_schedule: "Wed, Fri 02:00 - 04:00 PM",
    classroom_location: "VLSI & Embedded Lab 004",
    prerequisites: ["EC201"],
    learning_objectives: [
      "Configure preemptive task scheduling in FreeRTOS",
      "Interface analog and digital sensor telemetry across I2C buses",
      "Optimize battery life with sleep states and DMA transfers",
    ],
    syllabus_url: "https://campus.edu/syllabi/EC305_Spring2026.pdf",
    course_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    allow_enrolment: true,
    allow_faculty_collaboration: true,
    enrolment_deadline: "2027-05-30",
    approval_status: "APPROVED",
    publication_status: "PUBLISHED",
    is_published: true,
    submitted_at: "2025-12-15T15:00:00Z",
    reviewed_at: "2025-12-20T11:00:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004",
  },
  {
    id: "crs-cs410",
    course_code: "CS410",
    title: "Quantum Computation & Qubit Algorithms",
    description: "Quantum superposition, entanglement, Deutsch-Jozsa, Shor's factorisation algorithm, Grover's search, and programming quantum circuits with Qiskit.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    faculty_owner_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    credits: 3,
    lecture_hours: 3,
    lab_hours: 0,
    tutorial_hours: 0,
    course_category: "Elective",
    academic_year: "2025-2026",
    semester: "Semester 8",
    max_enrolment_capacity: 35,
    course_start_date: "2026-02-01",
    course_end_date: "2026-05-30",
    class_schedule: "Mon, Thu 04:00 - 05:30 PM",
    classroom_location: "Advanced Physics Lecture Theatre B",
    prerequisites: ["MATH201", "CS301"],
    learning_objectives: [
      "Simulate quantum register transformations using unitary matrices",
      "Execute quantum circuits on IBM Quantum hardware via cloud API",
      "Analyze post-quantum cryptographic resilience",
    ],
    syllabus_url: "https://campus.edu/syllabi/CS410_Spring2026.pdf",
    course_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    allow_enrolment: true,
    allow_faculty_collaboration: true,
    enrolment_deadline: "2026-05-15",
    approval_status: "PENDING_APPROVAL",
    publication_status: "DRAFT",
    is_published: false,
    submitted_at: "2026-03-20T14:00:00Z",
  },
  {
    id: "crs-cs412",
    course_code: "CS412",
    title: "Applied Blockchain & Decentralized Finance",
    description: "EVM mechanics, Solidity smart contract security auditing, decentralized state machines, zero-knowledge proofs, and cross-chain bridging.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    faculty_owner_id: "usr-faculty-02", // Dr. Rajesh Kumar
    credits: 3,
    lecture_hours: 2,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Elective",
    academic_year: "2025-2026",
    semester: "Semester 8",
    max_enrolment_capacity: 30,
    course_start_date: "2026-02-05",
    course_end_date: "2026-06-01",
    class_schedule: "Tue, Fri 11:30 AM - 01:00 PM",
    classroom_location: "Block 4 Room 204",
    prerequisites: ["CS201"],
    learning_objectives: [
      "Author reentrancy-safe smart contracts in Solidity",
      "Deploy layer-2 rollup verification nodes",
    ],
    syllabus_url: "https://campus.edu/syllabi/CS412_Spring2026.pdf",
    allow_enrolment: false,
    allow_faculty_collaboration: true,
    enrolment_deadline: "2026-05-10",
    approval_status: "MODIFICATIONS_REQUESTED",
    publication_status: "DRAFT",
    is_published: false,
    submitted_at: "2026-03-18T10:00:00Z",
    reviewed_at: "2026-03-22T09:00:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004",
    modification_notes: "Please include a comprehensive section on smart contract vulnerability fuzzing and clarify prerequisites regarding Cryptography.",
  },
  {
    id: "crs-cs415",
    course_code: "CS415",
    title: "AI Alignment, Safety & Frontier Model Evaluations",
    description: "Mechanistic interpretability, reinforcement learning from human feedback (RLHF), constitutional AI, red-teaming methodologies, and prompt safety guardrails.",
    department_id: "dept-cse",
    programme_id: "prg-mtech-ai",
    faculty_owner_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    credits: 4,
    lecture_hours: 3,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Core",
    academic_year: "2025-2026",
    semester: "Semester 2",
    max_enrolment_capacity: 25,
    course_start_date: "2026-02-15",
    course_end_date: "2026-06-10",
    class_schedule: "Wed 02:00 - 05:00 PM",
    classroom_location: "Ethics & AI Seminar Suite",
    prerequisites: ["CS302"],
    learning_objectives: [
      "Conduct probe evaluations on transformer internal activation states",
      "Benchmark model outputs against adversarial red-team benchmarks",
    ],
    allow_enrolment: false,
    allow_faculty_collaboration: false,
    approval_status: "DRAFT",
    publication_status: "DRAFT",
    is_published: false,
  },
  {
    id: "crs-cs420",
    course_code: "CS420",
    title: "High-Performance Computing & GPU Acceleration",
    description: "CUDA programming, thread divergence, shared memory coalescing, OpenMP, MPI distributed clusters, and performance profiling with NVIDIA Nsight.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    faculty_owner_id: "usr-faculty-02",
    credits: 3,
    lecture_hours: 2,
    lab_hours: 2,
    tutorial_hours: 0,
    course_category: "Elective",
    academic_year: "2025-2026",
    semester: "Semester 8",
    max_enrolment_capacity: 40,
    prerequisites: ["CS301"],
    approval_status: "REJECTED",
    publication_status: "DRAFT",
    is_published: false,
    submitted_at: "2026-03-10T12:00:00Z",
    reviewed_at: "2026-03-14T15:30:00Z",
    reviewed_by: "d0000001-0000-0000-0000-000000000004",
    rejection_reason: "Overlaps significantly with CS302 Lab modules. Faculty committee recommends integrating these GPU exercises into existing elective curricula.",
  },
];

export const DEMO_SECTIONS: CourseSection[] = [
  {
    id: "sec-cs301-a",
    course_id: "crs-cs301",
    section_code: "Section A (Morning)",
    room: "Turing-304",
    schedule: "Mon, Wed 10:00 - 11:30 AM",
    max_seats: 60,
    enrolled_count: 58,
    faculty_id: "d0000001-0000-0000-0000-000000000003",
  },
  {
    id: "sec-cs302-a",
    course_id: "crs-cs302",
    section_code: "Section A (Lab Intensive)",
    room: "AI-Lab-102",
    schedule: "Tue, Thu 02:00 - 03:30 PM",
    max_seats: 45,
    enrolled_count: 42,
    faculty_id: "d0000001-0000-0000-0000-000000000003",
  },
  {
    id: "sec-cs303-a",
    course_id: "crs-cs303",
    section_code: "Section A (Cloud Sandbox)",
    room: "DevOps-201",
    schedule: "Fri 09:00 AM - 01:00 PM",
    max_seats: 50,
    enrolled_count: 50, // Capacity full to demonstrate waitlist behavior
    faculty_id: "usr-faculty-02",
  },
  {
    id: "sec-ec305-a",
    course_id: "crs-ec305",
    section_code: "Section A (Hardware Workbench)",
    room: "VLSI-004",
    schedule: "Wed, Fri 02:00 - 04:00 PM",
    max_seats: 40,
    enrolled_count: 36,
    faculty_id: "usr-faculty-02",
  },
];

export const DEMO_COURSE_REQUESTS: CourseEnrolmentRequest[] = [
  {
    id: "req-join-01",
    course_id: "crs-cs301",
    section_id: "sec-cs301-a",
    applicant_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: "Eager to specialize in Operating Systems and Distributed Systems architecture for my final year project.",
    status: "APPROVED",
    reviewed_by: "d0000001-0000-0000-0000-000000000003",
    reviewed_at: "2026-03-15T11:20:00Z",
    created_at: "2026-03-14T09:30:00Z",
    updated_at: "2026-03-15T11:20:00Z",
  },
  {
    id: "req-join-02",
    course_id: "crs-cs302",
    section_id: "sec-cs302-a",
    applicant_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: "Interested in deep learning and neural networks for academic research in natural language processing.",
    status: "PENDING",
    created_at: "2026-03-22T14:15:00Z",
    updated_at: "2026-03-22T14:15:00Z",
  },
  {
    id: "req-join-03",
    course_id: "crs-cs301",
    section_id: "sec-cs301-a",
    applicant_id: "usr-student-02", // Diya Patel
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: "Mandatory core curriculum requirements for 6th semester B.Tech CSE.",
    status: "PENDING",
    created_at: "2026-03-23T10:00:00Z",
    updated_at: "2026-03-23T10:00:00Z",
  },
  {
    id: "req-join-04",
    course_id: "crs-cs303",
    applicant_id: "usr-student-03", // Rohan Verma
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: "Elective course application for database scaling and cloud indexing.",
    status: "WAITLISTED",
    created_at: "2026-03-21T08:45:00Z",
    updated_at: "2026-03-21T08:45:00Z",
  },
  {
    id: "req-join-05",
    course_id: "crs-ec305",
    applicant_id: "usr-student-04", // Ananya Iyer
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: "Applying for embedded systems elective.",
    status: "REJECTED",
    rejection_reason: "Prerequisite course EC201 (Digital Circuits) not yet completed with passing grade.",
    reviewed_by: "usr-faculty-02",
    reviewed_at: "2026-03-20T17:00:00Z",
    created_at: "2026-03-19T11:00:00Z",
    updated_at: "2026-03-20T17:00:00Z",
  },
  {
    id: "req-collab-01",
    course_id: "crs-cs301",
    applicant_id: "usr-faculty-02", // Dr. Rajesh Kumar
    applicant_role: "faculty",
    request_type: "faculty_collaboration",
    requested_role: "co_instructor",
    reason: "Offer co-instruction on UNIX kernel scheduling modules and coordinate distributed computing laboratory sessions.",
    status: "PENDING",
    created_at: "2026-03-22T16:00:00Z",
    updated_at: "2026-03-22T16:00:00Z",
  },
  {
    id: "req-collab-02",
    course_id: "crs-cs302",
    applicant_id: "usr-faculty-02",
    applicant_role: "faculty",
    request_type: "faculty_collaboration",
    requested_role: "contributor",
    reason: "Provide hardware-accelerated tensor benchmarking suites and test datasets for student assignments.",
    status: "APPROVED",
    reviewed_by: "d0000001-0000-0000-0000-000000000003",
    reviewed_at: "2026-03-18T14:00:00Z",
    created_at: "2026-03-17T11:00:00Z",
    updated_at: "2026-03-18T14:00:00Z",
  },
];

export const DEMO_COURSE_MEMBERSHIPS: CourseMembership[] = [
  // Course Owner
  {
    id: "mem-01",
    course_id: "crs-cs301",
    user_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    role: "course_owner",
    status: "ACTIVE",
    created_at: "2025-12-15T14:30:00Z",
    updated_at: "2025-12-15T14:30:00Z",
  },
  {
    id: "mem-02",
    course_id: "crs-cs302",
    user_id: "d0000001-0000-0000-0000-000000000003", // Dr. Elena Rostova
    role: "course_owner",
    status: "ACTIVE",
    created_at: "2025-12-16T16:00:00Z",
    updated_at: "2025-12-16T16:00:00Z",
  },
  {
    id: "mem-03",
    course_id: "crs-cs303",
    user_id: "usr-faculty-02", // Dr. Rajesh Kumar
    role: "course_owner",
    status: "ACTIVE",
    created_at: "2025-12-18T10:30:00Z",
    updated_at: "2025-12-18T10:30:00Z",
  },
  // Approved Faculty Collaborator
  {
    id: "mem-04",
    course_id: "crs-cs302",
    user_id: "usr-faculty-02", // Dr. Rajesh Kumar
    role: "contributor",
    status: "ACTIVE",
    created_at: "2026-03-18T14:00:00Z",
    updated_at: "2026-03-18T14:00:00Z",
  },
  // Enrolled Student
  {
    id: "mem-05",
    course_id: "crs-cs301",
    user_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    role: "student",
    status: "ACTIVE",
    created_at: "2026-03-15T11:20:00Z",
    updated_at: "2026-03-15T11:20:00Z",
  },
  {
    id: "mem-06",
    course_id: "crs-cs301",
    user_id: "d0000001-0000-0000-0000-000000000002", // Rahul Kumar
    role: "student",
    status: "ACTIVE",
    created_at: "2026-01-05T09:00:00Z",
    updated_at: "2026-01-05T09:00:00Z",
  },
];

export const DEMO_COURSE_MATERIALS: CourseLearningMaterial[] = [
  {
    id: "mat-01",
    course_id: "crs-cs301",
    title: "Official Course Syllabus & Grading Rubric",
    description: "Detailed week-by-week curriculum breakdown, exam weightings, and recommended textbooks.",
    material_type: "syllabus",
    file_url: "https://campus.edu/materials/cs301/syllabus_v2.pdf",
    file_size_bytes: 524288,
    uploaded_by: "d0000001-0000-0000-0000-000000000003",
    is_public: true,
    display_order: 1,
    created_at: "2026-01-08T10:00:00Z",
  },
  {
    id: "mat-02",
    course_id: "crs-cs301",
    title: "Lecture 01-04: Process Lifecycle & POSIX Threading",
    description: "Slide deck covering fork, exec, context switching, CPU registers, and pthread primitives.",
    material_type: "slides",
    file_url: "https://campus.edu/materials/cs301/lec01_processes.pdf",
    file_size_bytes: 4194304,
    uploaded_by: "d0000001-0000-0000-0000-000000000003",
    is_public: true,
    display_order: 2,
    created_at: "2026-01-12T14:30:00Z",
  },
  {
    id: "mat-03",
    course_id: "crs-cs301",
    title: "Linux Kernel Module (LKM) Skeleton & Build Makefile",
    description: "Starter repository for Assignment 01: loadable kernel module development and ring-0 debugging.",
    material_type: "code",
    file_url: "https://github.com/smart-campus/cs301-lkm-starter.git",
    file_size_bytes: 1048576,
    uploaded_by: "d0000001-0000-0000-0000-000000000003",
    is_public: true,
    display_order: 3,
    created_at: "2026-01-18T09:15:00Z",
  },
  {
    id: "mat-04",
    course_id: "crs-cs301",
    title: "Research Paper: In Search of an Understandable Consensus Algorithm (Raft)",
    description: "Ongaro & Ousterhout (Stanford 2014) foundation paper for distributed replication.",
    material_type: "notes",
    file_url: "https://raft.github.io/raft.pdf",
    file_size_bytes: 819200,
    uploaded_by: "d0000001-0000-0000-0000-000000000003",
    is_public: true,
    display_order: 4,
    created_at: "2026-02-01T11:00:00Z",
  },
  {
    id: "mat-05",
    course_id: "crs-cs302",
    title: "Transformer Attention Mechanics & PyTorch Implementation Guide",
    description: "Comprehensive notebook demonstrating self-attention matrix derivation and FlashAttention profiling.",
    material_type: "notes",
    file_url: "https://campus.edu/materials/cs302/transformers_deepdive.ipynb",
    file_size_bytes: 2097152,
    uploaded_by: "d0000001-0000-0000-0000-000000000003",
    is_public: true,
    display_order: 1,
    created_at: "2026-01-20T16:00:00Z",
  },
];

export const DEMO_ENROLMENTS: CourseEnrolment[] = [
  {
    id: "enr-01",
    student_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    academic_semester_id: "sem-spring-2026",
    status: "approved",
    enrolled_at: "2026-01-08T10:00:00Z",
  },
  {
    id: "enr-02",
    student_id: "d0000001-0000-0000-0000-000000000002", // Rahul Kumar
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    academic_semester_id: "sem-spring-2026",
    status: "approved",
    enrolled_at: "2026-01-08T11:30:00Z",
  },
  {
    id: "enr-03",
    student_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    section_id: "sec-cs302-a",
    course_id: "crs-cs302",
    academic_semester_id: "sem-spring-2026",
    status: "pending",
    enrolled_at: "2026-03-22T14:15:00Z",
  },
  {
    id: "enr-04",
    student_id: "usr-student-03", // Rohan Verma
    section_id: "sec-cs303-a",
    course_id: "crs-cs303",
    academic_semester_id: "sem-spring-2026",
    status: "waitlisted",
    waitlist_position: 1,
    enrolled_at: "2026-03-21T08:45:00Z",
  },
];

export const DEMO_ASSIGNMENTS: AcademicAssignment[] = [
  {
    id: "asg-01",
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    created_by: "d0000001-0000-0000-0000-000000000003",
    title: "Operating Systems Lab 1: Kernel Thread Scheduler",
    instructions: "Implement a cooperative round-robin user-space thread scheduler in C using setcontext and swapcontext.",
    max_marks: 100,
    due_date: "2026-04-10T23:59:59Z",
    submission_types: ["pdf", "zip"],
    is_published: true,
  },
  {
    id: "asg-02",
    section_id: "sec-cs302-a",
    course_id: "crs-cs302",
    created_by: "d0000001-0000-0000-0000-000000000003",
    title: "Deep Learning Mini-Project: Vision Transformer Fine-tuning",
    instructions: "Fine-tune a ViT-B/16 architecture on CIFAR-100 with cutmix data augmentation and cosine learning rate scheduler.",
    max_marks: 100,
    due_date: "2026-04-18T23:59:59Z",
    submission_types: ["pdf", "zip"],
    is_published: true,
  },
];

export const DEMO_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-01",
    assignment_id: "asg-01",
    student_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    file_url: "https://campus.edu/submissions/aarav_lab1.zip",
    file_name: "kernel_driver.pdf",
    version: 1,
    status: "submitted",
    submitted_at: "2026-04-05T18:22:00Z",
    obtained_marks: 94,
    feedback: "Excellent synchronization design with minimal context switch overhead.",
    evaluated_by: "d0000001-0000-0000-0000-000000000003",
  },
  {
    id: "sub-02",
    assignment_id: "asg-01",
    student_id: "d0000001-0000-0000-0000-000000000002", // Rahul Kumar
    file_url: "https://campus.edu/submissions/rahul_lab1.pdf",
    file_name: "rahul_lab1.pdf",
    version: 1,
    status: "submitted",
    submitted_at: "2026-04-06T14:10:00Z",
  },
];

export const DEMO_EXAMINATIONS: AcademicExamination[] = [
  {
    id: "exam-01",
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    title: "Mid-Term Examination: Operating Systems",
    exam_type: "midterm",
    total_marks: 50,
    passing_marks: 20,
    duration_minutes: 90,
    scheduled_start: "2026-03-28T10:00:00Z",
    scheduled_end: "2026-03-28T11:30:00Z",
    room: "Hall-304",
    status: "scheduled",
    is_published: true,
    questions: [
      { id: "q1", question_text: "Describe the four conditions required for deadlock to occur.", max_marks: 10, question_type: "descriptive" },
      { id: "q2", question_text: "Explain the difference between paging and segmentation.", max_marks: 15, question_type: "descriptive" },
      { id: "q3", question_text: "Calculate effective memory access time given TLB hit ratio 95%, TLB lookup 10ns, memory access 80ns.", max_marks: 25, question_type: "numerical" },
    ],
  },
];

export const DEMO_EXAM_ATTEMPTS: ExaminationAttempt[] = [
  {
    id: "att-01",
    examination_id: "exam-01",
    student_id: "d0000001-0000-0000-0000-000000000001",
    marks_obtained: 46,
    status: "graded",
    graded_by: "d0000001-0000-0000-0000-000000000003",
    graded_at: "2026-03-29T16:00:00Z",
  },
];

export const DEMO_GRADES: AcademicGradeRecord[] = [
  {
    id: "grd-01",
    student_id: "d0000001-0000-0000-0000-000000000001", // Aarav Sharma
    course_id: "crs-cs301",
    section_id: "sec-cs301-a",
    academic_semester_id: "sem-spring-2026",
    internal_assessment_score: 48,
    continuous_assessment_score: 45,
    final_exam_score: 92,
    total_score: 93.5,
    letter_grade: "A+",
    grade_points: 10,
    credits_earned: 4,
    remarks: "Outstanding academic performance and laboratory participation.",
    is_published: true,
  },
  {
    id: "grd-02",
    student_id: "d0000001-0000-0000-0000-000000000002", // Rahul Kumar
    course_id: "crs-cs301",
    section_id: "sec-cs301-a",
    academic_semester_id: "sem-spring-2026",
    internal_assessment_score: 40,
    continuous_assessment_score: 38,
    final_exam_score: 78,
    total_score: 79,
    letter_grade: "B+",
    grade_points: 8,
    credits_earned: 4,
    remarks: "Good comprehension of kernel architecture.",
    is_published: false,
  },
];

export const DEMO_PROJECTS: AcademicProject[] = [
  {
    id: "proj-01",
    title: "Autonomous Campus Delivery Drone Navigation Mesh",
    description: "RTOS-driven quadcopter guidance using visual SLAM and ultra-wideband campus indoor anchors.",
    department_id: "dept-cse",
    programme_id: "prg-btech-cse",
    academic_year_id: "ay-2025-26",
    supervisor_faculty_id: "d0000001-0000-0000-0000-000000000003",
    project_type: "capstone",
    status: "in_progress",
    rubric_scores: {
      problemDefinition: 18,
      technicalArchitecture: 23,
      innovation: 18,
      testingValidation: 17,
      presentationViva: 15,
    },
    defense_date: "2026-05-12T14:00:00Z",
    created_at: "2026-01-10T10:00:00Z",
  },
];

export const DEMO_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: "att-ses-01",
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    faculty_id: "d0000001-0000-0000-0000-000000000003",
    session_date: "2026-03-23",
    start_time: "10:00:00",
    end_time: "11:30:00",
    topic_covered: "Virtual Memory Paging and Multi-Level Page Tables",
    records: [
      { id: "rec-01", session_id: "att-ses-01", student_id: "d0000001-0000-0000-0000-000000000001", status: "present" },
      { id: "rec-02", session_id: "att-ses-01", student_id: "d0000001-0000-0000-0000-000000000002", status: "present" },
    ],
  },
  {
    id: "att-ses-02",
    section_id: "sec-cs301-a",
    course_id: "crs-cs301",
    faculty_id: "d0000001-0000-0000-0000-000000000003",
    session_date: "2026-03-25",
    start_time: "10:00:00",
    end_time: "11:30:00",
    topic_covered: "Demand Paging and Page Replacement Algorithms (LRU, FIFO)",
    records: [
      { id: "rec-03", session_id: "att-ses-02", student_id: "d0000001-0000-0000-0000-000000000001", status: "present" },
      { id: "rec-04", session_id: "att-ses-02", student_id: "d0000001-0000-0000-0000-000000000002", status: "absent" },
    ],
  },
];

// ==============================================================================
// SERVICE IMPLEMENTATIONS & WORKFLOW ENGINES
// ==============================================================================

/**
 * Creates a new Academic Course (Administrator or Faculty)
 */
export async function createAcademicCourse(
  courseData: Partial<AcademicCourse>
): Promise<AcademicCourse> {
  const newCourse: AcademicCourse = {
    id: `crs-${Date.now()}`,
    course_code: courseData.course_code || `CRS-${Math.floor(Math.random() * 900 + 100)}`,
    title: courseData.title || "Untitled Course",
    description: courseData.description || "",
    department_id: courseData.department_id || "dept-cse",
    programme_id: courseData.programme_id || "prg-btech-cse",
    faculty_owner_id: courseData.faculty_owner_id || "d0000001-0000-0000-0000-000000000003",
    credits: courseData.credits || 4,
    lecture_hours: courseData.lecture_hours || 3,
    lab_hours: courseData.lab_hours || 2,
    tutorial_hours: courseData.tutorial_hours || 0,
    course_category: courseData.course_category || "Core",
    academic_year: courseData.academic_year || "2025-2026",
    semester: courseData.semester || "Semester 6",
    max_enrolment_capacity: courseData.max_enrolment_capacity || 50,
    course_start_date: courseData.course_start_date || "2026-01-10",
    course_end_date: courseData.course_end_date || "2026-05-20",
    class_schedule: courseData.class_schedule || "Mon, Wed 10:00 - 11:30 AM",
    classroom_location: courseData.classroom_location || "Hall 304",
    prerequisites: courseData.prerequisites || [],
    learning_objectives: courseData.learning_objectives || [],
    syllabus_url: courseData.syllabus_url || null,
    course_image_url: courseData.course_image_url || null,
    allow_enrolment: courseData.allow_enrolment ?? true,
    allow_faculty_collaboration: courseData.allow_faculty_collaboration ?? true,
    enrolment_deadline: courseData.enrolment_deadline || "2026-05-01",
    approval_status: courseData.approval_status || "APPROVED",
    publication_status: courseData.publication_status || "PUBLISHED",
    is_published: courseData.is_published ?? true,
    submitted_at: courseData.submitted_at || new Date().toISOString(),
  };

  DEMO_COURSES.unshift(newCourse);
  return newCourse;
}

/**
 * Toggles course publication state
 */
export async function toggleCoursePublish(
  courseId: string,
  isPublished?: boolean
): Promise<{ success: boolean; is_published: boolean }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, is_published: false };
  }

  const newState = isPublished !== undefined ? isPublished : !course.is_published;
  course.is_published = newState;
  course.publication_status = newState ? "PUBLISHED" : "UNPUBLISHED";

  return { success: true, is_published: newState };
}

/**
 * Submits course enrolment (Supports Section Enrolment & Capacity Guardrails)
 */
export async function submitCourseEnrolment(
  studentIdOrPayload: string | { studentId: string; sectionId: string; courseId: string; semesterId?: string },
  sectionIdArg?: string,
  courseIdArg?: string,
  semesterIdArg?: string
): Promise<{
  success: boolean;
  enrolment?: CourseEnrolment;
  status?: EnrolmentStatus;
  message?: string;
  error?: string;
}> {
  let studentId = "";
  let sectionId = "";
  let courseId = "";
  let semesterId = "sem-spring-2026";

  if (typeof studentIdOrPayload === "object") {
    studentId = studentIdOrPayload.studentId;
    sectionId = studentIdOrPayload.sectionId;
    courseId = studentIdOrPayload.courseId;
    if (studentIdOrPayload.semesterId) semesterId = studentIdOrPayload.semesterId;
  } else {
    studentId = studentIdOrPayload;
    sectionId = sectionIdArg || "";
    courseId = courseIdArg || "";
    if (semesterIdArg) semesterId = semesterIdArg;
  }

  // Check duplicate enrolment
  const existing = DEMO_ENROLMENTS.find(
    (e) => e.student_id === studentId && (e.course_id === courseId || e.section_id === sectionId)
  );

  if (existing) {
    return {
      success: false,
      message: "Student is already registered or has a pending enrolment for this course.",
      error: "Duplicate registration prohibited",
    };
  }

  // Capacity verification
  const section = DEMO_SECTIONS.find((s) => s.id === sectionId);
  const isFull = section ? section.enrolled_count >= section.max_seats : false;

  const enrolmentStatus: EnrolmentStatus = isFull ? "waitlisted" : "pending";
  const waitlistPos = isFull ? 1 : undefined;

  const newEnrolment: CourseEnrolment = {
    id: `enr-${Date.now()}`,
    student_id: studentId,
    section_id: sectionId,
    course_id: courseId,
    academic_semester_id: semesterId,
    status: enrolmentStatus,
    waitlist_position: waitlistPos,
    enrolled_at: new Date().toISOString(),
  };

  DEMO_ENROLMENTS.unshift(newEnrolment);

  return {
    success: true,
    enrolment: newEnrolment,
    status: enrolmentStatus,
    message: isFull
      ? "Course section is currently at full capacity. Placed on priority waitlist."
      : "Course enrolment registration submitted successfully.",
  };
}

/**
 * Updates an enrolment's status (Admin / Faculty)
 */
export async function updateEnrolmentStatus(
  enrolmentId: string,
  status: EnrolmentStatus,
  reviewerIdOrReason?: string,
  reasonArg?: string
): Promise<{ success: boolean; enrolment?: CourseEnrolment; message?: string }> {
  const enrolment = DEMO_ENROLMENTS.find((e) => e.id === enrolmentId);
  if (!enrolment) {
    return { success: false, message: "Enrolment record not found" };
  }

  enrolment.status = status;
  return { success: true, enrolment, message: `Enrolment successfully marked as ${status}` };
}

/**
 * Creates an academic assignment
 */
export async function createAcademicAssignment(
  data: Partial<AcademicAssignment>
): Promise<{ success: boolean; assignment?: AcademicAssignment; message?: string }> {
  const newAssignment: AcademicAssignment = {
    id: `asg-${Date.now()}`,
    section_id: data.section_id || "sec-cs301-a",
    course_id: data.course_id || "crs-cs301",
    created_by: data.created_by || "d0000001-0000-0000-0000-000000000003",
    title: data.title || "New Assignment",
    instructions: data.instructions || "",
    max_marks: data.max_marks || 100,
    due_date: data.due_date || new Date(Date.now() + 86400000 * 7).toISOString(),
    submission_types: data.submission_types || ["pdf", "zip"],
    is_published: true,
  };

  DEMO_ASSIGNMENTS.unshift(newAssignment);
  return { success: true, assignment: newAssignment, message: "Assignment created successfully" };
}

/**
 * Submits student assignment solution
 */
export async function submitStudentAssignment(
  payloadOrAssignmentId:
    | { assignmentId: string; studentId: string; fileName: string; submissionText?: string }
    | string,
  studentIdArg?: string,
  fileUrlArg?: string,
  fileSizeArg?: number
): Promise<{ success: boolean; submission?: AssignmentSubmission; message?: string }> {
  let assignmentId = "";
  let studentId = "";
  let fileName = "submission.pdf";
  let fileUrl = "https://campus.edu/submissions/file.pdf";

  if (typeof payloadOrAssignmentId === "object") {
    assignmentId = payloadOrAssignmentId.assignmentId;
    studentId = payloadOrAssignmentId.studentId;
    fileName = payloadOrAssignmentId.fileName;
    fileUrl = `https://campus.edu/submissions/${fileName}`;
  } else {
    assignmentId = payloadOrAssignmentId;
    studentId = studentIdArg || "";
    fileUrl = fileUrlArg || "https://campus.edu/submissions/file.pdf";
    fileName = fileUrl.split("/").pop() || "submission.pdf";
  }

  const newSub: AssignmentSubmission = {
    id: `sub-${Date.now()}`,
    assignment_id: assignmentId,
    student_id: studentId,
    file_url: fileUrl,
    file_name: fileName,
    file_size_bytes: fileSizeArg || 1048576,
    version: 1,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  };

  DEMO_SUBMISSIONS.unshift(newSub);
  return { success: true, submission: newSub, message: "Assignment submitted successfully" };
}

/**
 * Evaluates assignment submission
 */
export async function evaluateAssignmentSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  evaluatorId?: string
): Promise<{ success: boolean; submission?: AssignmentSubmission; message?: string }> {
  const sub = DEMO_SUBMISSIONS.find((s) => s.id === submissionId);
  if (!sub) {
    return { success: false, message: "Submission not found" };
  }

  sub.obtained_marks = score;
  sub.feedback = feedback;
  sub.status = "evaluated";
  sub.evaluated_by = evaluatorId || "d0000001-0000-0000-0000-000000000003";

  return { success: true, submission: sub, message: "Submission successfully evaluated" };
}

/**
 * Creates academic examination
 */
export async function createAcademicExamination(
  data: Partial<AcademicExamination>
): Promise<{ success: boolean; examination?: AcademicExamination; message?: string }> {
  const newExam: AcademicExamination = {
    id: `exam-${Date.now()}`,
    section_id: data.section_id || "sec-cs301-a",
    course_id: data.course_id || "crs-cs301",
    title: data.title || "Mid-Term Examination",
    exam_type: data.exam_type || "midterm",
    total_marks: data.total_marks || 50,
    passing_marks: data.passing_marks || 20,
    duration_minutes: data.duration_minutes || 90,
    scheduled_start: data.scheduled_start || new Date().toISOString(),
    scheduled_end: data.scheduled_end || new Date().toISOString(),
    room: data.room || "Hall 304",
    status: "scheduled",
    is_published: true,
    questions: data.questions || [],
  };

  DEMO_EXAMINATIONS.unshift(newExam);
  return { success: true, examination: newExam, message: "Examination created successfully" };
}

/**
 * Records attendance session
 */
export async function recordAttendanceSession(
  dataOrPayload:
    | Partial<AttendanceSession>
    | {
        sectionId?: string;
        section_id?: string;
        course_id?: string;
        facultyId?: string;
        faculty_id?: string;
        faculty_owner_id?: string;
        sessionDate?: string;
        session_date?: string;
        slotTime?: string;
        slot_time?: string;
        topicCovered?: string;
        topic_covered?: string;
        topic?: string;
        records?: any[];
      },
  recordsArg?: Array<{ student_id: string; status: "present" | "absent" | "late" | "excused"; remarks?: string }>
): Promise<{ success: boolean; session?: AttendanceSession; message?: string }> {
  const payload = dataOrPayload as any;
  const newSession: AttendanceSession = {
    id: `att-ses-${Date.now()}`,
    section_id: payload.sectionId || payload.section_id || "sec-cs301-a",
    course_id: payload.course_id || "crs-cs301",
    faculty_id: payload.facultyId || payload.faculty_owner_id || payload.faculty_id || "d0000001-0000-0000-0000-000000000003",
    session_date: payload.sessionDate || payload.session_date || new Date().toISOString().split("T")[0],
    start_time: "10:00:00",
    end_time: "11:30:00",
    topic_covered: payload.topic || payload.topic_covered || "Lecture Session",
    records: (recordsArg || payload.records || []).map((r: any, idx: number) => ({
      id: `rec-${Date.now()}-${idx}`,
      session_id: `att-ses-${Date.now()}`,
      student_id: r.student_id || r.studentId,
      status: r.status,
      remarks: r.remarks,
    })),
  };

  DEMO_ATTENDANCE_SESSIONS.unshift(newSession);
  return { success: true, session: newSession, message: "Attendance session saved successfully" };
}

/**
 * Retrieves student attendance history and flags below 75% threshold
 */
export async function getStudentAttendanceHistory(studentId: string): Promise<{
  overallPercentage: number;
  courseBreakdown: Array<{
    courseCode: string;
    courseTitle: string;
    totalSessions: number;
    attended: number;
    percentage: number;
    isAtRisk: boolean;
  }>;
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
}> {
  const sessions = DEMO_ATTENDANCE_SESSIONS;
  return {
    overallPercentage: 84.5,
    courseBreakdown: [
      { courseCode: "CS301", courseTitle: "Operating Systems", totalSessions: 24, attended: 22, percentage: 92, isAtRisk: false },
      { courseCode: "CS302", courseTitle: "Deep Learning", totalSessions: 25, attended: 22, percentage: 88, isAtRisk: false },
      { courseCode: "CS303", courseTitle: "Cloud Native Systems", totalSessions: 20, attended: 14, percentage: 70, isAtRisk: true },
    ],
    sessions,
    records: [
      { id: "rec-01", session_id: "att-ses-01", student_id: studentId, status: "present" },
      { id: "rec-02", session_id: "att-ses-02", student_id: studentId, status: "present" },
    ],
  };
}

/**
 * Calculates academic risk indicators
 */
export async function calculateStudentAcademicRisk(studentId: string): Promise<{
  attendancePercentage: number;
  isAtRisk: boolean;
  reasons: string[];
}> {
  return {
    attendancePercentage: 73.5,
    isAtRisk: true,
    reasons: [
      "Attendance in CS303 is below mandatory 75% regulatory threshold (currently 70%)",
      "One lab deliverable currently marked late/pending evaluation",
    ],
  };
}

/**
 * Evaluates Capstone Project
 */
export async function evaluateCapstoneProject(
  projectId: string,
  stage: string,
  rubricScores: Record<string, number>,
  feedback?: string,
  approvedForDefense?: boolean
): Promise<{ success: boolean; message: string; project?: AcademicProject }> {
  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    return { success: false, message: "Capstone project not found" };
  }

  const totalScore = Object.values(rubricScores).reduce((sum, score) => sum + (Number(score) || 0), 0);
  project.rubric_scores = rubricScores;
  return {
    success: true,
    project,
    message: `Capstone project evaluation rubric for "${stage}" recorded successfully with total score ${totalScore}/100.`,
  };
}

/**
 * Publishes official gradebook records for section
 */
export async function publishGradesForSection(
  sectionId: string,
  publishedBy?: string
): Promise<{ success: boolean; count: number; message?: string }> {
  const records = DEMO_GRADES.filter((g) => g.section_id === sectionId);
  records.forEach((r) => {
    r.is_published = true;
  });

  return {
    success: true,
    count: records.length,
    message: `${records.length} gradebook records officially published and locked.`,
  };
}

// ==============================================================================
// SECTION A & B: FACULTY COURSE CREATION & ADMIN APPROVAL LIFECYCLE
// ==============================================================================

/**
 * Creates course by faculty: Save as Draft or Submit for Approval
 */
export async function createFacultyCourse(
  data: Partial<AcademicCourse>,
  saveAsDraft: boolean = false
): Promise<{ success: boolean; course?: AcademicCourse; error?: string }> {
  // Validate duplicate course code within the academic period
  const duplicate = DEMO_COURSES.find(
    (c) =>
      c.course_code.trim().toUpperCase() === (data.course_code || "").trim().toUpperCase() &&
      c.academic_year === (data.academic_year || "2025-2026")
  );

  if (duplicate) {
    return {
      success: false,
      error: `Course code ${data.course_code} already exists for academic year ${data.academic_year || "2025-2026"}.`,
    };
  }

  const approvalStatus: CourseApprovalStatus = saveAsDraft ? "DRAFT" : "PENDING_APPROVAL";
  const publicationStatus: CoursePublicationStatus = "DRAFT";

  const newCourse: AcademicCourse = {
    id: `crs-${Date.now()}`,
    course_code: (data.course_code || "").trim().toUpperCase(),
    title: data.title || "Untitled Course",
    description: data.description || "",
    department_id: data.department_id || "dept-cse",
    programme_id: data.programme_id || "prg-btech-cse",
    faculty_owner_id: data.faculty_owner_id || "d0000001-0000-0000-0000-000000000003",
    credits: data.credits || 4,
    lecture_hours: data.lecture_hours || 3,
    lab_hours: data.lab_hours || 2,
    tutorial_hours: data.tutorial_hours || 0,
    course_category: data.course_category || "Core",
    academic_year: data.academic_year || "2025-2026",
    semester: data.semester || "Semester 6",
    max_enrolment_capacity: data.max_enrolment_capacity || 50,
    course_start_date: data.course_start_date || "2026-02-01",
    course_end_date: data.course_end_date || "2026-05-30",
    class_schedule: data.class_schedule || "Mon, Wed 10:00 - 11:30 AM",
    classroom_location: data.classroom_location || "Turing Hall 304",
    prerequisites: data.prerequisites || [],
    learning_objectives: data.learning_objectives || [],
    syllabus_url: data.syllabus_url || null,
    course_image_url: data.course_image_url || null,
    allow_enrolment: data.allow_enrolment ?? true,
    allow_faculty_collaboration: data.allow_faculty_collaboration ?? true,
    enrolment_deadline: data.enrolment_deadline || "2027-05-30",
    approval_status: approvalStatus,
    publication_status: publicationStatus,
    is_published: false,
    submitted_at: saveAsDraft ? null : new Date().toISOString(),
  };

  DEMO_COURSES.unshift(newCourse);

  // Automatically register creator as course owner in memberships
  DEMO_COURSE_MEMBERSHIPS.push({
    id: `mem-${Date.now()}`,
    course_id: newCourse.id,
    user_id: newCourse.faculty_owner_id || "d0000001-0000-0000-0000-000000000003",
    role: "course_owner",
    membership_role: "course_owner",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return { success: true, course: newCourse };
}

/**
 * Updates faculty course
 */
export async function updateFacultyCourse(
  courseId: string,
  data: Partial<AcademicCourse>
): Promise<{ success: boolean; course?: AcademicCourse; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  // Update allowed fields
  Object.assign(course, data);
  if (data.approval_status === "PENDING_APPROVAL" && !course.submitted_at) {
    course.submitted_at = new Date().toISOString();
  }

  return { success: true, course };
}

/**
 * Admin Course Approval Management
 */
export async function adminReviewCourse(
  courseId: string,
  action: "approve" | "reject" | "request_modifications",
  reviewerId: string,
  rejectionReason?: string,
  modificationNotes?: string
): Promise<{ success: boolean; course?: AcademicCourse; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  course.reviewed_at = new Date().toISOString();
  course.reviewed_by = reviewerId;

  if (action === "approve") {
    course.approval_status = "APPROVED";
    course.publication_status = "PUBLISHED";
    course.is_published = true;
    course.rejection_reason = null;
    course.modification_notes = null;
  } else if (action === "reject") {
    course.approval_status = "REJECTED";
    course.publication_status = "DRAFT";
    course.is_published = false;
    course.rejection_reason = rejectionReason || "Course does not satisfy institutional curriculum standards.";
  } else if (action === "request_modifications") {
    course.approval_status = "MODIFICATIONS_REQUESTED";
    course.publication_status = "DRAFT";
    course.is_published = false;
    course.modification_notes = modificationNotes || "Please adjust syllabus objectives and prerequisites.";
  }

  return { success: true, course };
}

/**
 * Admin Toggle Course Publication (Publish / Unpublish)
 */
export async function adminToggleCoursePublication(
  courseId: string,
  publish: boolean
): Promise<{ success: boolean; course?: AcademicCourse; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  if (publish && course.approval_status !== "APPROVED") {
    return {
      success: false,
      error: "Only courses approved by university administrators can be published to the student catalogue.",
    };
  }

  course.is_published = publish;
  course.publication_status = publish ? "PUBLISHED" : "UNPUBLISHED";

  return { success: true, course };
}

// ==============================================================================
// SECTION C, D & E: JOIN REQUESTS & COLLABORATION WORKFLOW
// ==============================================================================

/**
 * Returns courses visible to students in the Course Catalogue
 * Must be APPROVED and PUBLISHED
 */
export function getStudentCourseCatalogue(
  studentId?: string,
  filters?: {
    department?: string;
    semester?: string;
    programme?: string;
    category?: string;
    search?: string;
  }
): AcademicCourse[] {
  let list = DEMO_COURSES.filter(
    (c) => c.approval_status === "APPROVED" && c.is_published && c.allow_enrolment
  );

  if (!filters) return list;

  if (filters.department && filters.department !== "all") {
    list = list.filter((c) => c.department_id === filters.department);
  }
  if (filters.semester && filters.semester !== "all") {
    list = list.filter((c) => c.semester === filters.semester);
  }
  if (filters.programme && filters.programme !== "all") {
    list = list.filter((c) => c.programme_id === filters.programme);
  }
  if (filters.category && filters.category !== "all") {
    list = list.filter((c) => c.course_category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.course_code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Submits student join request with full validations:
 * - Deadline check
 * - Duplicate request check
 * - Existing enrolment check
 * - Capacity check (marks as WAITLISTED if full)
 */
export async function submitStudentCourseJoinRequest(
  studentId: string,
  courseId: string,
  sectionId?: string,
  reason?: string
): Promise<{ success: boolean; request?: CourseEnrolmentRequest; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  if (course.approval_status !== "APPROVED" || !course.is_published) {
    return { success: false, error: "Course is not currently open for student enrolments." };
  }

  // Deadline check
  if (course.enrolment_deadline) {
    const deadline = new Date(course.enrolment_deadline).getTime();
    if (Date.now() > deadline) {
      return {
        success: false,
        error: `Enrolment deadline (${course.enrolment_deadline}) for this course has passed.`,
      };
    }
  }

  // Duplicate request check
  const existingReq = DEMO_COURSE_REQUESTS.find(
    (r) =>
      r.applicant_id === studentId &&
      r.course_id === courseId &&
      (r.status === "PENDING" || r.status === "APPROVED" || r.status === "WAITLISTED")
  );

  if (existingReq) {
    return {
      success: false,
      error: `You already have an active or approved request for course ${course.course_code} (Status: ${existingReq.status}).`,
    };
  }

  // Check active membership
  const existingMem = DEMO_COURSE_MEMBERSHIPS.find(
    (m) => m.course_id === courseId && m.user_id === studentId && m.status === "ACTIVE"
  );
  if (existingMem) {
    return { success: false, error: "You are already an active enrolled member of this course." };
  }

  // Calculate current enrolled count
  const enrolledCount = DEMO_COURSE_MEMBERSHIPS.filter(
    (m) => m.course_id === courseId && m.role === "student" && m.status === "ACTIVE"
  ).length;

  const isFull = enrolledCount >= course.max_enrolment_capacity;
  const status: CourseRequestStatus = isFull ? "WAITLISTED" : "PENDING";

  const newRequest: CourseEnrolmentRequest = {
    id: `req-join-${Date.now()}`,
    course_id: courseId,
    section_id: sectionId || null,
    applicant_id: studentId,
    applicant_role: "student",
    request_type: "student_join",
    requested_role: "student",
    reason: reason || "Enrolment request submitted via student course catalogue.",
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_COURSE_REQUESTS.unshift(newRequest);

  return { success: true, request: newRequest };
}

/**
 * Faculty Collaboration Request
 */
export async function submitFacultyCollaborationRequest(
  facultyId: string,
  courseId: string,
  requestedRole: CourseRequestedRole,
  reason: string
): Promise<{ success: boolean; request?: CourseEnrolmentRequest; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  if (!course.allow_faculty_collaboration) {
    return { success: false, error: "This course does not currently allow faculty collaboration requests." };
  }

  if (course.faculty_owner_id === facultyId) {
    return { success: false, error: "You are already the course owner." };
  }

  const existingReq = DEMO_COURSE_REQUESTS.find(
    (r) =>
      r.applicant_id === facultyId &&
      r.course_id === courseId &&
      r.request_type === "faculty_collaboration" &&
      r.status === "PENDING"
  );

  if (existingReq) {
    return { success: false, error: "You already have a pending collaboration request for this course." };
  }

  const newRequest: CourseEnrolmentRequest = {
    id: `req-collab-${Date.now()}`,
    course_id: courseId,
    applicant_id: facultyId,
    applicant_role: "faculty",
    request_type: "faculty_collaboration",
    requested_role: requestedRole,
    reason,
    status: "PENDING",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_COURSE_REQUESTS.unshift(newRequest);
  return { success: true, request: newRequest };
}

/**
 * Reviews a course request (individual approval or rejection)
 * If approved, atomicity ensures seat allocation & creates CourseMembership
 */
export async function reviewCourseRequest(
  requestId: string,
  action: "approve" | "reject",
  reviewerId: string,
  rejectionReason?: string
): Promise<{
  success: boolean;
  request?: CourseEnrolmentRequest;
  membership?: CourseMembership;
  error?: string;
}> {
  const request = DEMO_COURSE_REQUESTS.find((r) => r.id === requestId);
  if (!request) {
    return { success: false, error: "Request not found" };
  }

  const course = DEMO_COURSES.find((c) => c.id === request.course_id);
  if (!course) {
    return { success: false, error: "Associated course not found" };
  }

  request.reviewed_by = reviewerId;
  request.reviewed_at = new Date().toISOString();
  request.updated_at = new Date().toISOString();

  if (action === "reject") {
    request.status = "REJECTED";
    request.rejection_reason = rejectionReason || "Capacity or qualification requirements not met.";
    return { success: true, request };
  }

  // Atomic capacity verification for student join requests
  if (request.request_type === "student_join") {
    const activeStudents = DEMO_COURSE_MEMBERSHIPS.filter(
      (m) => m.course_id === course.id && m.role === "student" && m.status === "ACTIVE"
    ).length;

    if (activeStudents >= course.max_enrolment_capacity) {
      request.status = "WAITLISTED";
      return {
        success: false,
        request,
        error: `Cannot approve: Course capacity (${course.max_enrolment_capacity}) is fully exhausted. Request moved to WAITLISTED.`,
      };
    }
  }

  request.status = "APPROVED";
  request.rejection_reason = null;

  // Determine membership role
  let memberRole: CourseMembershipRole = "student";
  if (request.request_type === "faculty_collaboration") {
    memberRole =
      request.requested_role === "co_instructor"
        ? "co_instructor"
        : request.requested_role === "teaching_assistant"
        ? "teaching_assistant"
        : "contributor";
  }

  // Create membership
  const newMembership: CourseMembership = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    course_id: course.id,
    user_id: request.applicant_id,
    role: memberRole,
    membership_role: memberRole,
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_COURSE_MEMBERSHIPS.push(newMembership);

  return { success: true, request, membership: newMembership };
}

/**
 * Bulk approve student course join requests
 */
export async function bulkApproveStudentRequests(
  requestIds: string[],
  reviewerId: string
): Promise<{ success: boolean; approvedCount: number; errors: string[] }> {
  let approvedCount = 0;
  const errors: string[] = [];

  for (const id of requestIds) {
    const res = await reviewCourseRequest(id, "approve", reviewerId);
    if (res.success) {
      approvedCount++;
    } else if (res.error) {
      errors.push(res.error);
    }
  }

  return { success: approvedCount > 0, approvedCount, errors };
}

/**
 * Allows applicant to cancel their own pending/waitlisted request
 */
export async function cancelCourseRequest(
  requestId: string,
  applicantId: string
): Promise<{ success: boolean; error?: string }> {
  const req = DEMO_COURSE_REQUESTS.find((r) => r.id === requestId);
  if (!req) {
    return { success: false, error: "Request not found" };
  }

  if (req.applicant_id !== applicantId) {
    return { success: false, error: "Unauthorized: You can only cancel your own requests." };
  }

  if (req.status !== "PENDING" && req.status !== "WAITLISTED") {
    return { success: false, error: `Cannot cancel a request that is already ${req.status}.` };
  }

  req.status = "CANCELLED";
  req.updated_at = new Date().toISOString();

  return { success: true };
}

// ==============================================================================
// SECTION F: COURSE WORKSPACE & MATERIAL ACCESS
// ==============================================================================

/**
 * Returns full course workspace details with membership & material access control
 */
export function getCourseWorkspaceDetails(
  courseId: string,
  userId?: string,
  userRole?: string
): {
  course: AcademicCourse | null;
  materials: CourseLearningMaterial[];
  memberships: CourseMembership[];
  requests: CourseEnrolmentRequest[];
  isMember: boolean;
  userMembershipRole?: CourseMembershipRole;
} {
  const course = DEMO_COURSES.find((c) => c.id === courseId) || null;
  if (!course) {
    return {
      course: null,
      materials: [],
      memberships: [],
      requests: [],
      isMember: false,
    };
  }

  const materials = DEMO_COURSE_MATERIALS.filter((m) => m.course_id === courseId);
  const memberships = DEMO_COURSE_MEMBERSHIPS.filter(
    (m) => m.course_id === courseId && m.status === "ACTIVE"
  );
  const requests = DEMO_COURSE_REQUESTS.filter((r) => r.course_id === courseId);

  let isMember = false;
  let userMembershipRole: CourseMembershipRole | undefined;

  if (userId) {
    const userMem = memberships.find((m) => m.user_id === userId);
    if (userMem) {
      isMember = true;
      userMembershipRole = userMem.role || userMem.membership_role;
    } else if (course.faculty_owner_id === userId) {
      isMember = true;
      userMembershipRole = "course_owner";
    } else if (userRole === "administrator") {
      isMember = true;
      userMembershipRole = "course_owner";
    }
  }

  return {
    course,
    materials,
    memberships,
    requests,
    isMember,
    userMembershipRole,
  };
}

/**
 * Adds a new learning material to a course
 */
export async function addCourseLearningMaterial(
  courseId: string,
  material: Partial<CourseLearningMaterial>,
  uploaderId: string
): Promise<{ success: boolean; material?: CourseLearningMaterial; error?: string }> {
  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  const newMaterial: CourseLearningMaterial = {
    id: `mat-${Date.now()}`,
    course_id: courseId,
    title: material.title || "Untitled Document",
    description: material.description || "",
    material_type: material.material_type || "notes",
    file_type: (material.file_type || material.material_type || "notes") as any,
    file_url: material.file_url || "https://campus.edu/materials/document.pdf",
    file_size_bytes: material.file_size_bytes || 1048576,
    file_size_mb: material.file_size_mb || 1,
    uploaded_by: uploaderId,
    is_public: material.is_public ?? true,
    display_order: DEMO_COURSE_MATERIALS.filter((m) => m.course_id === courseId).length + 1,
    created_at: new Date().toISOString(),
  };

  DEMO_COURSE_MATERIALS.push(newMaterial);
  return { success: true, material: newMaterial };
}

/**
 * Filter requests by user
 */
export function getUserCourseRequests(userId: string): CourseEnrolmentRequest[] {
  return DEMO_COURSE_REQUESTS.filter((r) => r.applicant_id === userId);
}

/**
 * Filter requests for courses owned by faculty member
 */
export function getCourseRequestsForOwner(facultyId: string): CourseEnrolmentRequest[] {
  const ownedCourseIds = new Set(
    DEMO_COURSES.filter((c) => c.faculty_owner_id === facultyId).map((c) => c.id)
  );
  return DEMO_COURSE_REQUESTS.filter((r) => ownedCourseIds.has(r.course_id));
}

/**
 * Admin: Return all course requests across campus
 */
export function getAllCourseRequestsAdmin(): CourseEnrolmentRequest[] {
  return DEMO_COURSE_REQUESTS;
}
