/* =====================================================================
   VERDEMOBILITY — CAREERS RENDER ENGINE  (js/jobs-render.js)
   =====================================================================

   WHAT THIS FILE DOES
   ------------------------
   Reads the VM_JOBS array from js/jobs-data.js and turns it into the
   actual HTML for:
     - index.html          -> "Current Openings" section (top 3 featured)
     - careers.html         -> full "Open Positions" listing
     - career-details.html  -> single job detail page + related jobs

   You should NOT need to edit this file for normal day-to-day job
   updates — that all happens in js/jobs-data.js. Only touch this file
   if you want to change HOW jobs are displayed (e.g. change the number
   of homepage cards, change badge rules, etc.) — those settings are
   collected at the top under CONFIG.

   HOW career-details.html KNOWS WHICH JOB TO SHOW
   ---------------------------------------------------
   Every "View Details" / job-card link points to:
       career-details.html?job=<slug>
   career-details.html reads that ?job= value from the URL and looks up
   the matching entry in VM_JOBS. If no ?job= is present (e.g. someone
   opens the file directly), it falls back to showing the first active
   job in sort order, so the page never looks broken.
   ===================================================================== */

const VM_CAREERS_CONFIG = {
  NEW_BADGE_DAYS: 14,        // a job shows a "New" badge for this many days after postedDate
  HOMEPAGE_JOB_COUNT: 3,     // how many jobs show in index.html "Current Openings"
  RELATED_JOB_COUNT: 3       // how many "Related Jobs" show on career-details.html
};

/* ---------------------------------------------------------------------
   SMALL HELPERS
   --------------------------------------------------------------------- */

// Returns only jobs that should be publicly visible, sorted by sortOrder.
function vmGetActiveJobs() {
  return VM_JOBS
    .filter(function (job) { return job.status === "active"; })
    .sort(function (a, b) { return a.sortOrder - b.sortOrder; });
}

// True if a job was posted within the last NEW_BADGE_DAYS days.
function vmIsNew(job) {
  if (!job.postedDate) return false;
  var posted = new Date(job.postedDate + "T00:00:00");
  var diffDays = (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= VM_CAREERS_CONFIG.NEW_BADGE_DAYS;
}

// Builds a mailto: link with the recipient + subject pre-filled, so
// "Apply Now" opens the candidate's email app ready to send — no
// embedded form required.
function vmBuildMailto(job) {
  var subject = encodeURIComponent(job.applicationSubject || (job.title + " Application"));
  return "mailto:" + job.applyEmail + "?subject=" + subject;
}

// Reads a query-string parameter from the current page URL.
function vmGetQueryParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Basic HTML-escaping for text pulled from the data file, so a stray
// "&" or "<" typed into jobs-data.js can't break the page markup.
function vmEscape(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---------------------------------------------------------------------
   CARD BUILDERS (used by index.html + careers.html)
   --------------------------------------------------------------------- */

function vmBadgesHTML(job) {
  var html = '<span class="badge-dept">' + vmEscape(job.department) + '</span>';
  html += '<span class="badge-type">' + vmEscape(job.employmentTypeShort) + '</span>';
  if (vmIsNew(job)) {
    html += '<span class="badge-new">New</span>';
  }
  return html;
}

function vmJobCardHTML(job) {
  return (
    '<div class="col">' +
      '<article class="job-card">' +
        '<div class="d-flex gap-2 mb-3 flex-wrap">' + vmBadgesHTML(job) + '</div>' +
        '<h3 class="h5 mb-2">' + vmEscape(job.title) + '</h3>' +
        '<p class="job-meta mb-2"><i class="bi bi-geo-alt me-1"></i>' + vmEscape(job.location) + '</p>' +
        '<p class="job-desc mb-4">' + vmEscape(job.teaser) + '</p>' +
        '<div class="d-flex gap-2 flex-wrap">' +
          '<a href="' + vmBuildMailto(job) + '" class="btn btn-brand btn-sm">Apply Now</a>' +
          '<a href="career-details.html?job=' + encodeURIComponent(job.slug) + '" class="btn btn-outline-brand btn-sm">View Details</a>' +
        '</div>' +
      '</article>' +
    '</div>'
  );
}

function vmRelatedJobCardHTML(job) {
  return (
    '<div class="col">' +
      '<article class="related-job-card">' +
        '<div class="d-flex gap-2 mb-3 flex-wrap">' + vmBadgesHTML(job) + '</div>' +
        '<h3 class="h6 mb-2">' + vmEscape(job.title) + '</h3>' +
        '<p class="text-muted small mb-3"><i class="bi bi-geo-alt me-1"></i>' + vmEscape(job.location) + '</p>' +
        '<a href="career-details.html?job=' + encodeURIComponent(job.slug) + '" class="btn-vm-morph" style="padding-right:1.1rem;">' +
          '<span class="morph-icon" style="width:36px;height:36px;"><i class="bi bi-arrow-right"></i></span>' +
          '<span>View Details</span>' +
        '</a>' +
      '</article>' +
    '</div>'
  );
}

/* ---------------------------------------------------------------------
   PAGE: index.html — "Current Openings" (homepage teaser section)
   --------------------------------------------------------------------- */

function vmRenderHomepageOpenings() {
  var grid = document.getElementById("openings-grid");
  var emptyState = document.getElementById("openings-empty");
  if (!grid) return; // this page doesn't have the container — nothing to do

  var jobs = vmGetActiveJobs()
    .filter(function (job) { return job.featured; })
    .slice(0, VM_CAREERS_CONFIG.HOMEPAGE_JOB_COUNT);

  if (jobs.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");
  grid.innerHTML = jobs.map(vmJobCardHTML).join("");
}

/* ---------------------------------------------------------------------
   PAGE: careers.html — full "Open Positions" listing
   --------------------------------------------------------------------- */

function vmRenderCareersList() {
  var grid = document.getElementById("careers-grid");
  var emptyState = document.getElementById("careers-empty");
  var countLabel = document.getElementById("careers-count");
  if (!grid) return;

  var jobs = vmGetActiveJobs();

  if (countLabel) {
    countLabel.textContent = jobs.length === 0
      ? "No open positions at the moment"
      : "Showing " + jobs.length + " of " + jobs.length + " roles";
  }

  if (jobs.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");
  grid.innerHTML = jobs.map(vmJobCardHTML).join("");
}

/* ---------------------------------------------------------------------
   PAGE: career-details.html — single job detail + related jobs
   --------------------------------------------------------------------- */

function vmSectionHTML(section) {
  var html = '<div class="content-section mb-5"><h2>' + vmEscape(section.heading) + '</h2>';

  if (section.type === "paragraph") {
    html += '<p class="text-muted">' + vmEscape(section.body) + '</p>';
  } else if (section.type === "list") {
    html += '<ul>' + section.items.map(function (item) {
      return '<li>' + vmEscape(item) + '</li>';
    }).join("") + '</ul>';
  } else if (section.type === "labeled-list") {
    html += '<ul>' + section.items.map(function (item) {
      return '<li><strong>' + vmEscape(item.label) + ':</strong> ' + vmEscape(item.detail) + '</li>';
    }).join("") + '</ul>';
  }

  html += '</div>';
  return html;
}

// These two sections are NOT written by hand in jobs-data.js — they are
// built automatically from fields every job already has (job.experience,
// job.applicationSubject, job.applicationNote). This guarantees every
// job's detail page always shows Experience + Application Guidelines,
// in the same place (right after that job's own custom "sections"),
// without you needing to repeat this text manually for each job.
function vmAutoSections(job) {
  var autoSections = [];

  if (job.experience) {
    autoSections.push({
      heading: "Experience",
      type: "paragraph",
      body: job.experience
    });
  }

  if (job.applicationSubject || job.applicationNote) {
    var guidelineParts = [];
    if (job.applicationSubject) {
      guidelineParts.push('Candidates must send their application with subject "' + job.applicationSubject + '".');
    }
    if (job.applicationNote) {
      guidelineParts.push(job.applicationNote);
    }
    autoSections.push({
      heading: "Application Guidelines",
      type: "paragraph",
      body: guidelineParts.join(" ")
    });
  }

  return autoSections;
}

function vmRenderJobDetail() {
  var container = document.getElementById("job-detail-root");
  if (!container) return; // not on this page

  var slug = vmGetQueryParam("job");
  var job = slug ? VM_JOBS.find(function (j) { return j.slug === slug; }) : null;

  // Fallback: no ?job= given (e.g. file opened directly) -> show the
  // first active job in sort order, so the page is never blank.
  if (!job) {
    job = vmGetActiveJobs()[0];
  }

  if (!job) {
    // No jobs exist at all (empty state at the detail-page level).
    container.innerHTML =
      '<div class="container py-5 text-center">' +
        '<h1 class="h3 mb-3">No open positions right now</h1>' +
        '<p class="text-muted">Please check back soon, or view <a href="careers.html">all careers</a>.</p>' +
      '</div>';
    return;
  }

  if (job.status === "discontinued" || job.status === "draft") {
    container.innerHTML =
      '<div class="container py-5 text-center">' +
        '<h1 class="h3 mb-3">This position is no longer open</h1>' +
        '<p class="text-muted mb-4">"' + vmEscape(job.title) + '" is currently not accepting applications. ' +
        'Explore our other current openings below.</p>' +
        '<a href="careers.html" class="btn btn-brand">View All Openings</a>' +
      '</div>';
    return;
  }

  // ---- Breadcrumb ----
  var breadcrumbCurrent = document.getElementById("job-breadcrumb-current");
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = job.title;

  // ---- Header (badges, title, meta chips, apply button) ----
  var header = document.getElementById("job-header-root");
  if (header) {
    header.innerHTML =
      '<div class="d-flex gap-2 mb-3 flex-wrap">' + vmBadgesHTML(job) + '</div>' +
      '<h1 class="h2 mb-1">' + vmEscape(job.title) + '</h1>' +
      '<p class="text-muted small mb-3">Job ID: ' + vmEscape(job.id) + '</p>' +
      '<div class="row gy-2 mb-4">' +
        '<div class="col-6 col-md-3"><div class="meta-chip"><i class="bi bi-geo-alt"></i> ' + vmEscape(job.location) + '</div></div>' +
        '<div class="col-6 col-md-3"><div class="meta-chip"><i class="bi bi-briefcase"></i> ' + vmEscape(job.employmentTypeShort) + '</div></div>' +
        '<div class="col-6 col-md-3"><div class="meta-chip"><i class="bi bi-graph-up"></i> ' + vmEscape(job.experience) + ' Experience</div></div>' +
        '<div class="col-6 col-md-3"><div class="meta-chip"><i class="bi bi-cash-stack"></i> Salary: ' + vmEscape(job.salary) + '</div></div>' +
      '</div>' +
      '<div class="d-flex gap-2 flex-wrap align-items-center">' +
        '<a href="' + vmBuildMailto(job) + '" class="btn btn-brand">Apply Now</a>' +
        '<a href="careers.html" class="btn-vm-morph">' +
          '<span class="morph-icon"><i class="bi bi-arrow-left"></i></span>' +
          '<span>Back to Careers</span>' +
        '</a>' +
      '</div>';
      // Note: the applicationNote line that used to sit here was moved into
      // the "Application Guidelines" content section below (see
      // vmAutoSections), so it isn't repeated twice on the page.
  }

  // ---- Main content sections (Job Description / Skills / etc.) ----
  // Order: this job's own custom sections first (from jobs-data.js), then
  // the automatic Experience + Application Guidelines sections last —
  // matching "Education, Skill(s), Additional Skill(s), Experience,
  // Application Guidelines" from the HR job post format.
  var content = document.getElementById("job-content-root");
  if (content) {
    var allSections = (job.sections || []).concat(vmAutoSections(job));
    content.innerHTML = allSections.map(vmSectionHTML).join("");
  }

  // ---- Sidebar "Job Overview" ----
  // "Job ID" is always shown first — it's added here automatically (not
  // something you type into each job's "overview" array in jobs-data.js),
  // so it can never accidentally go missing from a job listing.
  var sidebar = document.getElementById("job-sidebar-root");
  if (sidebar) {
    var overviewRows = [{ label: "Job ID", value: job.id }].concat(job.overview || []);
    var rows = overviewRows.map(function (row) {
      return '<div class="row-line"><span>' + vmEscape(row.label) + '</span><span>' + vmEscape(row.value) + '</span></div>';
    }).join("");
    sidebar.innerHTML =
      '<h2 class="h5 mb-3">Job Overview</h2>' +
      rows +
      '<a href="' + vmBuildMailto(job) + '" class="btn btn-brand w-100 mt-4">Apply Now</a>';
  }

  // ---- Related jobs: same department, excluding this job, active only ----
  var related = document.getElementById("related-jobs-grid");
  var relatedSection = document.getElementById("related-jobs-section");
  if (related) {
    var relatedJobs = vmGetActiveJobs()
      .filter(function (j) { return j.department === job.department && j.slug !== job.slug; })
      .slice(0, VM_CAREERS_CONFIG.RELATED_JOB_COUNT);

    if (relatedJobs.length === 0) {
      if (relatedSection) relatedSection.classList.add("d-none");
    } else {
      if (relatedSection) relatedSection.classList.remove("d-none");
      related.innerHTML = relatedJobs.map(vmRelatedJobCardHTML).join("");
    }
  }
}

/* ---------------------------------------------------------------------
   INIT — runs on every page; each render function no-ops if its
   container isn't present, so one script file safely covers all
   three career pages.
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  vmRenderHomepageOpenings();
  vmRenderCareersList();
  vmRenderJobDetail();
});
