/* =====================================================================
   VERDEMOBILITY — CAREERS DATA FILE  (js/jobs-data.js)
   =====================================================================

   WHAT THIS FILE IS
   ------------------
   This is the ONLY place you edit when a job opens, changes, or closes.
   index.html, careers.html and career-details.html all read from the
   VM_JOBS array below (via js/jobs-render.js). There is no database —
   this array IS the database, for now. When the project is later
   rebuilt in React, this same array structure can be dropped straight
   into a React data file or fetched as JSON with almost no changes.

   HOW TO ADD A NEW JOB
   ---------------------
   1. Copy an existing job object below (the {...} block), paste it as
      a new item in the VM_JOBS array, and give it a comma before/after.
   2. Change "id" to a NEW, UNIQUE code (e.g. "SPE04", "MKT02"). This is
      also used to build the job's URL, so keep it short, no spaces.
   3. Fill in title, department, location, etc.
   4. Set "sortOrder" — LOWER NUMBERS SHOW FIRST. Leave gaps (10, 20,
      30...) so you can slot a new job in between later without
      renumbering everything.
   5. Set "status" to "active" so it shows up on the site (see STATUS
      VALUES below).
   6. Set "postedDate" to today's date (YYYY-MM-DD). This drives the
      automatic "New" badge — see NEW BADGE LOGIC below.

   HOW TO CLOSE / DISCONTINUE A JOB
   ----------------------------------
   Do NOT delete the job object. Just change:
       status: "active"   ->   status: "discontinued"
   The job will disappear from index.html and careers.html automatically.
   If someone has an old link to that job's detail page, they will see
   a polite "This position is no longer open" message instead of a
   broken page. Keeping the object also means you can re-open it later
   just by flipping status back to "active".

   STATUS VALUES
   -------------
   "active"        -> visible everywhere (default for a live opening)
   "discontinued"  -> hidden from listings, detail page shows closed message
   "draft"         -> hidden everywhere (use this while you're still
                      writing up a job description, before it goes live)

   SORT ORDER
   ----------
   All active jobs are sorted by "sortOrder" (ascending) before being
   displayed on index.html and careers.html. Featured jobs on the
   homepage are also picked using this same order (see "featured" below).

   NEW BADGE LOGIC (automatic — you don't set this by hand)
   ----------------------------------------------------------
   js/jobs-render.js checks "postedDate" against today's date. If a job
   was posted within the last NEW_BADGE_DAYS days (set in jobs-render.js,
   default 14), a "New" badge is added automatically. You never need to
   turn this on/off manually — just keep postedDate accurate.

   FEATURED (which jobs show on the index.html homepage)
   ---------------------------------------------------------
   Only jobs with "featured: true" are eligible for the homepage
   "Current Openings" section (max 3 shown, picked by sortOrder). Every
   job — featured or not — still shows on the full careers.html list.
   Use this to keep the homepage limited to your 3 priority roles.

   APPLYING (mailto — no embedded form, per current setup)
   ------------------------------------------------------------
   "Apply Now" buttons build a mailto: link automatically from
   applyEmail + applicationSubject, so the candidate's email app opens
   with the recipient and subject line already filled in (e.g. subject
   "[SPE03] Job Application"), and applicationNote is shown as a small
   line under the button. This matches the "no JOB ID = not considered"
   requirement from HR without needing an actual web form.

   SECTIONS (the body of the job detail page)
   -------------------------------------------
   Different job types need different content blocks — a solar EPC role
   has Education / Skills / Additional Skills, while an engineering role
   has Responsibilities / Required Skills / Qualifications / Benefits.
   Rather than hard-coding either shape, each job has a "sections" array
   you can freely add to, reorder, or shorten per job. Each section has:
     - heading: the h2 title shown on the page (e.g. "Responsibilities")
     - type:    "paragraph"     -> body is a single string of text
                "list"          -> items is a plain bullet list of strings
                "labeled-list"  -> items is a list of {label, detail}
                                   pairs, rendered as "Label: detail"
                                   (used for things like Additional
                                   Skills where each point has a title)
   ===================================================================== */

const VM_JOBS = [

  /* -------------------------------------------------------------------
     JOB: Senior Project Engineer (Solar EPC) — real opening, from HR
     ------------------------------------------------------------------- */
  {
    id: "SPE03",                          // used in URLs + email subject — must stay unique
    slug: "senior-project-engineer-spe03",
    title: "Senior Project Engineer",
    department: "Engineering",
    type: "Full time permanent position", // long-form type, shown in a couple of places
    employmentTypeShort: "Full-Time",     // short badge text, e.g. "Full-Time" / "Part-Time" / "Internship"
    vacancies: 1,
    location: "V.U. Nagar, Gujarat, India",
    experience: "3-4 years",
    salary: "Not Disclosed",

    sortOrder: 10,
    status: "active",        // active | discontinued | draft
    postedDate: "2026-07-15", // YYYY-MM-DD — drives the automatic "New" badge
    featured: true,           // eligible to appear on index.html homepage

    // Short one-line teaser used on job-card previews (index.html / careers.html)
    teaser: "Lead engineering efforts for solar EPC projects (1 MW+) from design through execution.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[SPE03] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    // Sidebar "Job Overview" rows on career-details.html — label/value pairs
    overview: [
      { label: "Department", value: "Engineering" },
      { label: "Location", value: "V.U. Nagar, Gujarat" },
      { label: "Employment Type", value: "Full-Time, Permanent" },
      { label: "Experience", value: "3-4 Years" },
      { label: "Vacancies", value: "1" },
      { label: "Salary", value: "Not Disclosed" }
    ],

    sections: [
      {
        heading: "Education",
        type: "list",
        items: [
          "BE / ME / BTech / MTech in Electrical / Electronics / Mechanical or equivalent"
        ]
      },
      {
        heading: "Skill(s)",
        type: "list",
        items: [
          "Proven experience in managing large-scale solar projects (1 MW+).",
          "Strong knowledge of solar PV systems, inverters, transformers, and grid integration.",
          "Proficiency with design software (e.g., Sketchup, PVsyst, Helioscope).",
          "Strong leadership, communication, and project management skills.",
          "Ability to handle multiple projects simultaneously"
        ]
      },
      {
        heading: "Additional Skill(s)",
        type: "labeled-list",
        items: [
          { label: "Project Management", detail: "Lead engineering efforts for solar EPC projects from design to execution." },
          { label: "Design and Engineering", detail: "Review, develop, and optimize electrical, civil, and mechanical designs for solar projects." },
          { label: "Vendor Coordination", detail: "Work with procurement and vendors to ensure timely delivery of materials and equipment." },
          { label: "Regulatory Compliance", detail: "Ensure all designs and installations comply with local codes, regulations, and standards (NEC, IEC, etc.)." },
          { label: "Team Leadership", detail: "Mentor junior engineers and collaborate with multidisciplinary teams." },
          { label: "Cost & Schedule Management", detail: "Ensure projects are delivered on time and within budget, tracking progress and resolving issues." },
          { label: "Site Supervision", detail: "Oversee site activities, ensuring quality control and safety compliance." },
          { label: "Technical Reporting", detail: "Prepare and present project reports, technical documentation, and as-built drawings." }
        ]
      }
    ]
  },

  /* -------------------------------------------------------------------
     JOB: Embedded Firmware Engineer — existing sample content, kept as
     a second real example showing the "paragraph + list" section style
     ------------------------------------------------------------------- */
  {
    id: "EFE01",
    slug: "embedded-firmware-engineer-efe01",
    title: "Embedded Firmware Engineer",
    department: "Engineering",
    type: "Full time permanent position",
    employmentTypeShort: "Full-Time",
    vacancies: 1,
    location: "Anand, Gujarat",
    experience: "2-4 Years",
    salary: "Not Disclosed",

    sortOrder: 20,
    status: "active",
    postedDate: "2026-06-20",
    featured: true,

    teaser: "Design and develop firmware for AC/DC EV charger controllers, ensuring reliability and OCPP compliance.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[EFE01] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    overview: [
      { label: "Department", value: "Engineering" },
      { label: "Location", value: "Anand, Gujarat" },
      { label: "Employment Type", value: "Full-Time" },
      { label: "Experience", value: "2-4 Years" },
      { label: "Salary", value: "Not Disclosed" }
    ],

    sections: [
      {
        heading: "Job Description",
        type: "paragraph",
        body: "VerdeMobility is looking for an Embedded Firmware Engineer to design, develop, and maintain firmware for our AC and DC EV charger controllers. You'll work closely with hardware and cloud teams to build safe, reliable, and OCPP/OCPI-compliant charging products used across homes, businesses, and public charging networks."
      },
      {
        heading: "Responsibilities",
        type: "list",
        items: [
          "Design and implement firmware for charger controllers and power modules.",
          "Collaborate with hardware engineers on board bring-up and testing.",
          "Implement and maintain OCPP/OCPI communication protocols.",
          "Debug field issues and deliver over-the-air firmware updates.",
          "Write technical documentation for internal and QA teams."
        ]
      },
      {
        heading: "Required Skills",
        type: "list",
        items: [
          "Strong proficiency in Embedded C/C++.",
          "Experience with microcontrollers (STM32, ESP32, or similar).",
          "Familiarity with communication protocols: CAN, Modbus, RS-485.",
          "Understanding of OCPP/OCPI is a strong plus.",
          "Experience with RTOS-based development."
        ]
      },
      {
        heading: "Qualifications",
        type: "list",
        items: [
          "Bachelor's degree in Electronics, Electrical, or Computer Engineering.",
          "2-4 years of relevant embedded firmware experience.",
          "Prior experience in EV charging, IoT, or power electronics preferred."
        ]
      },
      {
        heading: "Benefits",
        type: "list",
        items: [
          "Competitive compensation and performance bonuses.",
          "Health insurance coverage.",
          "Flexible working hours and hybrid options.",
          "Opportunity to work on cutting-edge EV charging technology.",
          "Learning & development support."
        ]
      }
    ]
  },

  /* -------------------------------------------------------------------
     JOB: Business Development Manager — active
     ------------------------------------------------------------------- */
  {
    id: "BDM01",
    slug: "business-development-manager-bdm01",
    title: "Business Development Manager",
    department: "Sales & Marketing",
    type: "Full time permanent position",
    employmentTypeShort: "Full-Time",
    vacancies: 1,
    location: "Ahmedabad, Gujarat",
    experience: "3-5 Years",
    salary: "Not Disclosed",

    sortOrder: 30,
    status: "active",
    postedDate: "2026-05-10",
    featured: true,

    teaser: "Drive B2B partnerships across fleets, real estate, and hospitality to expand our charging network.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[BDM01] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    overview: [
      { label: "Department", value: "Sales & Marketing" },
      { label: "Location", value: "Ahmedabad, Gujarat" },
      { label: "Employment Type", value: "Full-Time" },
      { label: "Experience", value: "3-5 Years" },
      { label: "Salary", value: "Not Disclosed" }
    ],

    sections: [
      {
        heading: "Job Description",
        type: "paragraph",
        body: "We're looking for a Business Development Manager to grow VerdeMobility's B2B charging network across fleets, real estate, and hospitality partners."
      },
      {
        heading: "Responsibilities",
        type: "list",
        items: [
          "Identify and close new B2B partnerships for charger deployment.",
          "Build relationships with fleet operators, property developers, and hospitality chains.",
          "Work with the product team to tailor proposals to partner needs."
        ]
      }
    ]
  },

  /* -------------------------------------------------------------------
     JOB: Installation & Field Service Engineer — active
     ------------------------------------------------------------------- */
  {
    id: "IFE01",
    slug: "installation-field-service-engineer-ife01",
    title: "Installation & Field Service Engineer",
    department: "Operations",
    type: "Full time permanent position",
    employmentTypeShort: "Full-Time",
    vacancies: 2,
    location: "Anand, Gujarat",
    experience: "1-3 Years",
    salary: "Not Disclosed",

    sortOrder: 40,
    status: "active",
    postedDate: "2026-04-02",
    featured: false, // shows on careers.html, but not in the homepage top-3

    teaser: "Handle on-site installation, commissioning, and troubleshooting of AC/DC chargers for commercial clients.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[IFE01] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    overview: [
      { label: "Department", value: "Operations" },
      { label: "Location", value: "Anand, Gujarat" },
      { label: "Employment Type", value: "Full-Time" },
      { label: "Experience", value: "1-3 Years" },
      { label: "Salary", value: "Not Disclosed" }
    ],

    sections: [
      {
        heading: "Job Description",
        type: "paragraph",
        body: "Handle on-site installation, commissioning, and troubleshooting of AC/DC EV chargers for commercial clients across Gujarat."
      }
    ]
  },

  /* -------------------------------------------------------------------
     JOB: Technical Support Specialist — active
     ------------------------------------------------------------------- */
  {
    id: "TSS01",
    slug: "technical-support-specialist-tss01",
    title: "Technical Support Specialist",
    department: "Customer Support",
    type: "Part time position",
    employmentTypeShort: "Part-Time",
    vacancies: 1,
    location: "Remote",
    experience: "0-2 Years",
    salary: "Not Disclosed",

    sortOrder: 50,
    status: "active",
    postedDate: "2026-03-18",
    featured: false,

    teaser: "Support charge point operators and end-users with troubleshooting, OTA updates, and app-related queries.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[TSS01] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    overview: [
      { label: "Department", value: "Customer Support" },
      { label: "Location", value: "Remote" },
      { label: "Employment Type", value: "Part-Time" },
      { label: "Experience", value: "0-2 Years" },
      { label: "Salary", value: "Not Disclosed" }
    ],

    sections: [
      {
        heading: "Job Description",
        type: "paragraph",
        body: "Support charge point operators and end-users with troubleshooting, OTA updates, and app-related queries."
      }
    ]
  },

  /* -------------------------------------------------------------------
     JOB: IoT Software Engineering Intern — EXAMPLE OF A CLOSED JOB.
     Notice status is "discontinued" below: it will NOT appear on
     index.html or careers.html, and if someone opens its direct link
     they'll see a "position no longer open" message instead of an error.
     This object is kept (not deleted) in case the internship reopens.
     ------------------------------------------------------------------- */
  {
    id: "INT01",
    slug: "iot-software-engineering-intern-int01",
    title: "IoT Software Engineering Intern",
    department: "Engineering",
    type: "Internship",
    employmentTypeShort: "Internship",
    vacancies: 0,
    location: "Anand, Gujarat",
    experience: "0 Years",
    salary: "Stipend",

    sortOrder: 60,
    status: "discontinued", // <-- this is the only thing that changed to close it
    postedDate: "2026-02-01",
    featured: false,

    teaser: "Assist in building cloud-connected features for our Central Management System using OCPP/OCPI protocols.",

    applyEmail: "career@slscorp.com",
    applicationSubject: "[INT01] Job Application",
    applicationNote: "Application without JOB ID would not be considered.",

    overview: [
      { label: "Department", value: "Engineering" },
      { label: "Location", value: "Anand, Gujarat" },
      { label: "Employment Type", value: "Internship" },
      { label: "Experience", value: "0 Years" },
      { label: "Salary", value: "Stipend" }
    ],

    sections: [
      {
        heading: "Job Description",
        type: "paragraph",
        body: "Assist in building cloud-connected features for our Central Management System using OCPP/OCPI protocols."
      }
    ]
  }

];
