// Progressive enhancement only — every page works without this file.
document.documentElement.classList.add("js");

const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
}

// Close the Disciplines dropdown on outside click / Escape (desktop).
const details = document.querySelector(".nav-details");
if (details) {
  document.addEventListener("click", (e) => { if (!details.contains(e.target)) details.removeAttribute("open"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") details.removeAttribute("open"); });
}

// Scroll reveals.
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("is-in"));
}

// Preselect the contact topic from ?topic= (links on each discipline page).
const topicSelect = document.getElementById("c-topic");
const topic = new URLSearchParams(location.search).get("topic");
if (topicSelect && topic) {
  const opt = [...topicSelect.options].find((o) => o.text.startsWith(topic));
  if (opt) topicSelect.value = opt.value;
}

// Kit forms: post to Kit without leaving the page, then show the confirm-your-email message.
// Without JavaScript the form still posts natively to the same Kit address.
document.querySelectorAll("form[data-kit]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = form.querySelector(".form-success");
    button.disabled = true;
    try {
      // Kit answers a successful signup with a 302 to its success page; don't follow it.
      const res = await fetch(form.action, { method: "POST", redirect: "manual", body: new URLSearchParams(new FormData(form)) });
      if (!(res.type === "opaqueredirect" || res.ok)) throw new Error("Kit returned " + res.status);
      form.querySelectorAll("input, button, fieldset").forEach((el) => { if (!el.closest(".form-note")) el.disabled = true; });
      if (success) { success.hidden = false; success.focus?.(); }
    } catch {
      button.disabled = false;
      if (success) { success.hidden = false; success.textContent = "That did not go through. Please try again, or email info@authenticityalgorithm.com."; }
    }
  });
});
