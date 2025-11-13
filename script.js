// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "dark";
if (currentTheme === "light") {
  html.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  const theme = html.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", theme);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }

    mobileMenu.classList.add("hidden");
  });
});

// Intersection Observer for Reveal Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in-up");

      // Animate skill bars when skills section comes into view
      if (entry.target.closest("#skills")) {
        const skillBars = entry.target.querySelectorAll(".skill-bar");
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.animation = "skillBar 2s ease-out forwards";
          }, index * 200);
        });
      }
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal-element").forEach((el) => {
  observer.observe(el);
});

// Project Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    // Update active button
    filterButtons.forEach((btn) => {
      btn.classList.remove("active", "bg-blue-500", "text-white");
      btn.classList.add("hover:bg-slate-700", "dark:hover:bg-slate-300");
    });
    button.classList.add("active", "bg-blue-500", "text-white");
    button.classList.remove("hover:bg-slate-700", "dark:hover:bg-slate-300");

    // Filter projects
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// Form Validation
const contactForm = document.getElementById("contact-form");
const formInputs = contactForm.querySelectorAll("input, textarea");

formInputs.forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => clearError(input));
});

function validateField(field) {
  const value = field.value.trim();

  clearError(field);

  if (field.name === "name" && value.length < 2) {
    showError(field, "Name must be at least 2 characters long");
    return false;
  }

  if (field.name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(field, "Please enter a valid email address");
      return false;
    }
  }

  if (field.name === "message") {
    // This require message to be more than 3 words (i.e. at least 4 words)
    const wordCount = value.split(/\s+/).filter(Boolean).length;
    if (wordCount <= 3) {
      showError(field, "Message must be more than 3 words (at least 4 words).");
      return false;
    }
  }

  return true;
}

function showError(field, message) {
  const errorElement = field.nextElementSibling;
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  field.classList.add("border-red-400");
}

function clearError(field) {
  const errorElement = field.nextElementSibling;
  errorElement.classList.add("hidden");
  field.classList.remove("border-red-400");
}

//  Formspree submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;
  formInputs.forEach((input) => {
    if (!validateField(input)) isValid = false;
  });

  const feedback = document.getElementById("form-feedback");
  const successMessage = feedback.querySelector(".success-message");
  const errorMessage = feedback.querySelector(".error-message");

  if (!isValid) {
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
    feedback.classList.remove("hidden");
    return;
  }

  // Send data to Formspree
  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      successMessage.classList.remove("hidden");
      errorMessage.classList.add("hidden");
      feedback.classList.remove("hidden");
      contactForm.reset();

      setTimeout(() => feedback.classList.add("hidden"), 5000);
    } else {
      throw new Error("Formspree submission failed");
    }
  } catch (err) {
    console.error(err);
    errorMessage.textContent = "Failed to send message. Please try again.";
    errorMessage.classList.remove("hidden");
    feedback.classList.remove("hidden");
  }
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.remove("opacity-0", "invisible");
    scrollToTopBtn.classList.add("opacity-100", "visible");
  } else {
    scrollToTopBtn.classList.add("opacity-0", "invisible");
    scrollToTopBtn.classList.remove("opacity-100", "visible");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Active Navigation Link Highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (
      window.pageYOffset >= sectionTop &&
      window.pageYOffset < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("text-blue-400", "dark:text-blue-600");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("text-blue-400", "dark:text-blue-600");
    }
  });
});

// Download CV Button
const downloadCvBtn = document.getElementById("download-cv");
downloadCvBtn.addEventListener("click", () => {
  const cvUrl = "assets/Alex_Johnson_CV.pdf";
  const link = document.createElement("a");
  link.href = cvUrl;
  link.download = "Alex_Johnson_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Formspree AJAX handling
const form = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (response.ok) {
      feedback.querySelector(".success-message").classList.remove("hidden");
      feedback.querySelector(".error-message").classList.add("hidden");
      feedback.classList.remove("hidden");
      form.reset();
    } else {
      feedback.querySelector(".success-message").classList.add("hidden");
      feedback.querySelector(".error-message").classList.remove("hidden");
      feedback.classList.remove("hidden");
    }
  } catch (error) {
    feedback.querySelector(".success-message").classList.add("hidden");
    feedback.querySelector(".error-message").classList.remove("hidden");
    feedback.classList.remove("hidden");
  }
});
