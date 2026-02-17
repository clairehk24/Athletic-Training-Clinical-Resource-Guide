const routes = [
  { id: "normal-vitals", label: "Normal vitals", file: "pages/normal-vitals.html" },
  { id: "gcs", label: "Glasgow Coma Scale", file: "pages/gcs.html" },
  { id: "reflexes", label: "Reflex grading", file: "pages/reflexes.html" },
  { id: "myotomes-dermatomes", label: "Myotomes & dermatomes", file: "pages/myotomes-dermatomes.html" },
  { id: "blood-labs", label: "Blood lab tests", file: "pages/blood-labs.html" },
  { id: "med-classes", label: "Common medication classes", file: "pages/med-classes.html" },
  { id: "billing-codes", label: "ICD/CPT/HCPCS codes", file: "pages/billing-codes.html" },
  { id: "abbreviations", label: "Abbreviations", file: "pages/abbreviations.html" },
];

const nav = document.getElementById("nav");
const content = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

function renderNav() {
  nav.innerHTML = routes
    .map(
      (r) => `
    <a href="#${r.id}" class="btn" style="display:block; text-align:left; margin:8px 0;">
      ${r.label}
    </a>
  `,
    )
    .join("");
}

async function loadRoute() {
  const hash = (location.hash || `#${routes[0].id}`).slice(1);
  const route = routes.find((r) => r.id === hash) || routes[0];

  const res = await fetch(route.file, { cache: "no-cache" });
  content.innerHTML = await res.text();

  // optional: apply search to new content
  applySearch(searchInput.value);
}

function applySearch(q) {
  q = (q || "").trim().toLowerCase();
  if (!q) {
    content.querySelectorAll("[data-searchable]").forEach((el) => (el.style.display = ""));
    return;
  }
  content.querySelectorAll("[data-searchable]").forEach((el) => {
    const hay = (el.getAttribute("data-searchable") + " " + el.textContent).toLowerCase();
    el.style.display = hay.includes(q) ? "" : "none";
  });
}

window.addEventListener("hashchange", loadRoute);
searchInput.addEventListener("input", (e) => applySearch(e.target.value));

renderNav();
loadRoute();
