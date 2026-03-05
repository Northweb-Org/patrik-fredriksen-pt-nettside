// --- EMAILJS PLASSHOLDERE ---
// Bytt ut disse tekstene med dine faktiske ID-er når du har laget bruker.
const PUBLIC_KEY = "DIN_PUBLIC_KEY_HER";
const SERVICE_ID = "DIN_SERVICE_ID_HER";
const TEMPLATE_ID = "DIN_TEMPLATE_ID_HER";

// Dette aktiverer EmailJS hvis du har byttet ut Public Key
if (PUBLIC_KEY !== "DIN_PUBLIC_KEY_HER") {
  emailjs.init(PUBLIC_KEY);
}

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // 1. Vis en "Sender..." status på knappen så brukeren vet at noe skjer
  const submitBtn = document.querySelector(".btn-submit");
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Sender...";
  submitBtn.disabled = true;

  // 2. Sikkerhetssjekk: Hindrer feilmeldinger før du har satt opp kontoen
  if (PUBLIC_KEY === "DIN_PUBLIC_KEY_HER") {
    alert(
      "Systemet for å sende melding er ikke helt ferdig satt opp enda! (Husk å legge inn EmailJS ID-er i koden).",
    );
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
    return; // Stopper koden her
  }

  // 3. Sender e-posten via EmailJS
  emailjs
    .sendForm(SERVICE_ID, TEMPLATE_ID, this)
    .then(
      function () {
        // Suksess!
        alert(
          "Takk! Meldingen din er sendt, og Patrick tar kontakt med deg snart.",
        );
        contactForm.reset(); // Tømmer skjemaet
      },
      function (error) {
        // Feilmelding hvis noe går galt
        alert("Oops! Noe gikk galt med sendingen. Prøv igjen senere.");
        console.log("Feil fra EmailJS:", error);
      },
    )
    .finally(function () {
      // Tilbakestiller knappen uansett om det gikk bra eller dårlig
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    });
});
