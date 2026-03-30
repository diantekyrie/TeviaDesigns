const revealItems = document.querySelectorAll(".reveal");
const mobileActionLinks = document.querySelectorAll("[data-mobile-href]");
const mobileOnlyActions = document.querySelectorAll(".mobile-only-action");
const googleFormLinks = document.querySelectorAll("[data-form-template-href]");

const isMobileDevice =
  window.matchMedia("(pointer: coarse)").matches ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

mobileActionLinks.forEach((link) => {
  const mobileHref = link.dataset.mobileHref;

  if (!mobileHref) {
    return;
  }

  if (isMobileDevice) {
    link.setAttribute("href", mobileHref);
    link.removeAttribute("aria-disabled");
    link.classList.remove("is-desktop-static");
    return;
  }

  link.removeAttribute("href");
  link.setAttribute("aria-disabled", "true");
  link.classList.add("is-desktop-static");
});

mobileOnlyActions.forEach((action) => {
  if (isMobileDevice) {
    action.hidden = false;
    action.disabled = false;
    return;
  }

  action.hidden = true;
  action.disabled = true;
});

googleFormLinks.forEach((link) => {
  const formHref = link.dataset.formTemplateHref;
  const isConfigured = formHref && !formHref.includes("YOUR_FORM_ID");

  if (isConfigured) {
    link.setAttribute("href", formHref);
    link.removeAttribute("aria-disabled");
    link.classList.remove("is-template-pending");
    return;
  }

  link.removeAttribute("href");
  link.setAttribute("aria-disabled", "true");
  link.classList.add("is-template-pending");
});

const requestForm = document.querySelector("#request-form");
const preview = document.querySelector("#message-preview");

if (requestForm && preview) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customerName = document.querySelector("#customer-name")?.value.trim();
    const customerGender = document.querySelector("#customer-gender")?.value;
    const requestType = document.querySelector("#request-type")?.value;
    const referenceSize = document.querySelector("#reference-size")?.value.trim();
    const timeline = document.querySelector("#request-timeline")?.value.trim();
    const details = document.querySelector("#request-details")?.value.trim();
    const measurements = [
      ["height", document.querySelector("#measurement-height")?.value.trim()],
      ["chest/bust", document.querySelector("#measurement-chest")?.value.trim()],
      ["waist", document.querySelector("#measurement-waist")?.value.trim()],
      ["hips", document.querySelector("#measurement-hips")?.value.trim()],
      ["inseam", document.querySelector("#measurement-inseam")?.value.trim()],
      ["shoulder", document.querySelector("#measurement-shoulder")?.value.trim()],
      ["sleeve", document.querySelector("#measurement-sleeve")?.value.trim()],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join(", ");

    const messageParts = [
      `Hi Tevia, my name is ${customerName || "a new client"}.`,
      customerGender ? `I’m ordering for a ${customerGender}.` : "",
      `I'm interested in ${requestType || "a custom piece"}.`,
      referenceSize ? `Closest US size: ${referenceSize}.` : "",
      timeline ? `My timeline is: ${timeline}.` : "",
      details ? `Details: ${details}` : "",
      measurements ? `Measurements: ${measurements}.` : "",
    ].filter(Boolean);

    const message = messageParts.join(" ");
    const smsUrl = `sms:+14156103924?&body=${encodeURIComponent(message)}`;

    preview.textContent = message;
    window.location.href = smsUrl;
  });
}
