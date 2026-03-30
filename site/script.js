const revealItems = document.querySelectorAll(".reveal");

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

const requestForm = document.querySelector("#request-form");
const preview = document.querySelector("#message-preview");

if (requestForm && preview) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customerName = document.querySelector("#customer-name")?.value.trim();
    const requestType = document.querySelector("#request-type")?.value;
    const timeline = document.querySelector("#request-timeline")?.value.trim();
    const details = document.querySelector("#request-details")?.value.trim();

    const messageParts = [
      `Hi Tevia, my name is ${customerName || "a new client"}.`,
      `I'm interested in ${requestType || "a custom piece"}.`,
      timeline ? `My timeline is: ${timeline}.` : "",
      details ? `Details: ${details}` : "",
    ].filter(Boolean);

    const message = messageParts.join(" ");
    const smsUrl = `sms:+19253037364?&body=${encodeURIComponent(message)}`;

    preview.textContent = message;
    window.location.href = smsUrl;
  });
}
