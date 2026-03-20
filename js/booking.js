document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (form) {
    const steps = document.querySelectorAll(".quiz-step");
    const nextBtns = document.querySelectorAll(".btn-next");
    const backBtns = document.querySelectorAll(".btn-back");
    const progress = document.getElementById("progress");
    const submitBtn = form.querySelector(".btn-submit");
    let currentStep = 1;

    // --- NAVIGATIONLOGIC ---

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

    // --- SENDING VIA EMAIL ---

    // 1. Create the status div dynamically if it doesn't exist
    let statusDiv = document.getElementById("form-status");
    if (!statusDiv) {
      statusDiv = document.createElement("div");
      statusDiv.id = "form-status";
      statusDiv.style.marginTop = "15px";
      statusDiv.style.fontWeight = "bold";
      form.appendChild(statusDiv);
    }

    // Notice the arrow => added here!
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Visual feedback
      submitBtn.innerText = "Sender...";
      submitBtn.disabled = true;
      statusDiv.style.display = "none";

      // 2. Scoop up all the form data automatically
      const rawFormData = new FormData(form);
      const userName = rawFormData.get("user_name");
      const userEmail = rawFormData.get("user_email");

      // Grab the radio buttons (if they didn't select one, default to text)
      const alder = rawFormData.get("alder") || "Ikke valgt";
      const frekvens = rawFormData.get("frekvens") || "Ikke valgt";
      const sted = rawFormData.get("sted") || "Ikke valgt";

      // 3. Package it into the standard format your Cloudflare API expects!
      const formData = {
        name: userName,
        email: userEmail,
        // We inject the quiz answers directly into the message body
        message: `Ny PT-henvendelse fra nettsiden!\n\nAlder: ${alder}\nØnsket frekvens: ${frekvens}\nForetrukket sted: ${sted}`,
      };

      // 4. Send to your centralized agency API
      const WORKER_URL = "https://forms.northweb.no";

      try {
        const response = await fetch(WORKER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          statusDiv.style.display = "block";
          statusDiv.style.color = "green";
          statusDiv.innerText = "Melding sendt! Vi tar kontakt snart.";

          // Reset form and go back to step 1
          form.reset();
          currentStep = 1;
          updateQuiz();
        } else {
          throw new Error("Server error");
        }
      } catch (error) {
        console.error("Form Error:", error);
        statusDiv.style.display = "block";
        statusDiv.style.color = "red";
        statusDiv.innerText = "Beklager, noe gikk galt. Prøv igjen senere.";
      } finally {
        submitBtn.innerText = "Send melding 🔥";
        submitBtn.disabled = false;
      }
    });
  }
});
