/* =====================================================================
   VERDEMOBILITY — JOBS DATA VALIDATOR  (tools/validate-jobs.js)
   =====================================================================

   WHAT THIS IS
   ------------
   A small, dependency-free Node script that checks js/jobs-data.js for
   common mistakes BEFORE you push a job update live — things that would
   otherwise fail silently (a typo'd status, a duplicate Job ID, a missing
   email) and only get noticed when a candidate can't apply.

   HOW TO RUN IT
   -------------
   From the project folder (the one containing js/jobs-data.js):

       node tools/validate-jobs.js

   It exits with code 0 (and prints "All checks passed") if everything
   looks good, or code 1 with a list of problems if not. Run it any time
   after editing js/jobs-data.js, before you upload/deploy.

   WHAT IT CHECKS
   --------------
   - Every job has the required fields (id, slug, title, department,
     location, experience, sortOrder, status, applyEmail,
     applicationSubject).
   - "id" and "slug" are both unique across all jobs — a duplicate would
     make career-details.html show the wrong job, or break the mailto
     subject line matching.
   - "status" is one of "active", "discontinued", "draft" — catches a
     typo like "Active" or "actve" that would otherwise just silently
     hide (or wrongly show) a job with no error anywhere.
   - "sortOrder" is a number (not a string like "10").
   - "postedDate" (if present) is a real date in YYYY-MM-DD format.
   - Every "sections" entry has a valid "heading" and a "type" that's one
     of "paragraph" / "list" / "labeled-list", with the matching data
     ("body" for paragraph, "items" for list/labeled-list) actually
     present and non-empty.
   - Every "overview" entry (if present) has both "label" and "value".

   This intentionally does NOT check things like spelling in the job
   description, or whether a location "looks right" — it only catches
   mistakes that would break the page or the data flow, not writing
   quality.
   ===================================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const JOBS_DATA_PATH = path.join(__dirname, "..", "js", "jobs-data.js");

const VALID_STATUSES = ["active", "discontinued", "draft"];
const VALID_SECTION_TYPES = ["paragraph", "list", "labeled-list"];
const REQUIRED_FIELDS = [
  "id", "slug", "title", "department", "location",
  "experience", "sortOrder", "status", "applyEmail", "applicationSubject"
];

function loadJobs() {
  if (!fs.existsSync(JOBS_DATA_PATH)) {
    console.error("Could not find js/jobs-data.js at: " + JOBS_DATA_PATH);
    process.exit(1);
  }
  const code = fs.readFileSync(JOBS_DATA_PATH, "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "jobs-data.js" });
  // NOTE: jobs-data.js declares "const VM_JOBS = [...]". A top-level const
  // in a vm context is NOT exposed as a property on the sandbox object
  // (that's just how Node's vm module handles block-scoped declarations) —
  // it has to be read back via another runInContext call in the same
  // context, which resolves it lexically instead.
  const jobs = vm.runInContext("VM_JOBS", sandbox);
  if (!Array.isArray(jobs)) {
    console.error("jobs-data.js did not produce a VM_JOBS array — check for a syntax error.");
    process.exit(1);
  }
  return jobs;
}

function isValidDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str + "T00:00:00");
  return !isNaN(d.getTime());
}

function validateJob(job, index) {
  const errors = [];
  const label = job && (job.id || job.title) ? (job.id || job.title) : ("job #" + (index + 1));

  REQUIRED_FIELDS.forEach(function (field) {
    if (job[field] === undefined || job[field] === null || job[field] === "") {
      errors.push('[' + label + '] missing required field "' + field + '"');
    }
  });

  if (job.status !== undefined && VALID_STATUSES.indexOf(job.status) === -1) {
    errors.push('[' + label + '] invalid status "' + job.status + '" — must be one of: ' + VALID_STATUSES.join(", "));
  }

  if (job.sortOrder !== undefined && typeof job.sortOrder !== "number") {
    errors.push('[' + label + '] "sortOrder" should be a number, got: ' + JSON.stringify(job.sortOrder));
  }

  if (job.postedDate !== undefined && !isValidDate(job.postedDate)) {
    errors.push('[' + label + '] "postedDate" should be YYYY-MM-DD, got: ' + JSON.stringify(job.postedDate));
  }

  (job.sections || []).forEach(function (section, sIndex) {
    const sLabel = '[' + label + '] sections[' + sIndex + ']';
    if (!section.heading) {
      errors.push(sLabel + ' is missing a "heading"');
    }
    if (VALID_SECTION_TYPES.indexOf(section.type) === -1) {
      errors.push(sLabel + ' has invalid "type": ' + JSON.stringify(section.type) + ' — must be one of: ' + VALID_SECTION_TYPES.join(", "));
    } else if (section.type === "paragraph" && !section.body) {
      errors.push(sLabel + ' is type "paragraph" but has no "body" text');
    } else if ((section.type === "list" || section.type === "labeled-list") && (!Array.isArray(section.items) || section.items.length === 0)) {
      errors.push(sLabel + ' is type "' + section.type + '" but "items" is missing or empty');
    }
  });

  (job.overview || []).forEach(function (row, rIndex) {
    if (!row.label || row.value === undefined || row.value === "") {
      errors.push('[' + label + '] overview[' + rIndex + '] needs both "label" and "value"');
    }
  });

  return errors;
}

function validateAll(jobs) {
  let errors = [];

  jobs.forEach(function (job, index) {
    errors = errors.concat(validateJob(job, index));
  });

  // Duplicate ID / slug checks (across the whole file, not per-job)
  const seenIds = {};
  const seenSlugs = {};
  jobs.forEach(function (job) {
    if (job.id) {
      if (seenIds[job.id]) errors.push('Duplicate Job ID found: "' + job.id + '"');
      seenIds[job.id] = true;
    }
    if (job.slug) {
      if (seenSlugs[job.slug]) errors.push('Duplicate slug found: "' + job.slug + '"');
      seenSlugs[job.slug] = true;
    }
  });

  return errors;
}

function main() {
  const jobs = loadJobs();
  console.log("Checking " + jobs.length + " job(s) in js/jobs-data.js ...\n");

  const errors = validateAll(jobs);

  if (errors.length === 0) {
    console.log("✔ All checks passed — no problems found.");
    process.exit(0);
  } else {
    console.log("✘ Found " + errors.length + " problem(s):\n");
    errors.forEach(function (err) { console.log("  - " + err); });
    console.log("\nFix these in js/jobs-data.js, then re-run this script.");
    process.exit(1);
  }
}

main();
