// --- EMAILJS KONFIGURASJON ---
const PUBLIC_KEY = "DIN_PUBLIC_KEY_HER";
const SERVICE_ID = "DIN_SERVICE_ID_HER";
const TEMPLATE_ID = "DIN_TEMPLATE_ID_HER";

if (PUBLIC_KEY !== "DIN_PUBLIC_KEY_HER") {
  emailjs.init(PUBLIC_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return; // Sikkerhet hvis skjemaet ikke finnes på siden

  const steps = document.querySelectorAll(".quiz-step");
  const nextBtns = document.querySelectorAll(".btn-next");
  const backBtns = document.querySelectorAll(".btn-back");
  const progress = document.getElementById("progress");
  const submitBtn = form.querySelector(".btn-submit");
  let currentStep = 1;

  // --- NAVIGASJONSLOGIKK ---

  function updateQuiz() {
    steps.forEach((step) => {
      step.classList.remove("active");
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add("active");
      }
    });
    const percent = (currentStep / steps.length) * 100;
    progress.style.width = percent + "%";
  }

  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Sjekker kun de påkrevde feltene i DETTE steget
      const currentStepEl = steps[currentStep - 1];
      const inputs = currentStepEl.querySelectorAll("input[required]");

      let allValid = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          allValid = false;
          input.style.borderColor = "red"; // Visuell feedback
        } else {
          input.style.borderColor = "";
        }
      });

      if (allValid && currentStep < steps.length) {
        currentStep++;
        updateQuiz();
      } else if (!allValid) {
        alert("Vennligst fyll ut navn og e-post før du går videre.");
      }
    });
  });

  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuiz();
      }
    });
  });

  // --- SENDING VIA EMAILJS ---

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sender...";
    submitBtn.disabled = true;

    // Sikkerhetssjekk for oppsett
    if (PUBLIC_KEY === "DIN_PUBLIC_KEY_HER") {
      alert(
        "Veldig bra! Quizen fungerer. Nå må du bare sette opp EmailJS-kontoen din for å faktisk motta disse e-postene.",
      );
      console.log(
        "Quiz-data klar for sending:",
        Object.fromEntries(new FormData(form)),
      );

      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
      return;
    }

    // Sender hele skjemaet til EmailJS
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, this)
      .then(() => {
        alert(
          "Takk! Patrick har mottatt informasjonen din og tar kontakt snart.",
        );
        form.reset();
        currentStep = 1;
        updateQuiz();
      })
      .catch((error) => {
        alert("Det skjedde en feil. Vennligst prøv igjen senere.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      });
  });
});
