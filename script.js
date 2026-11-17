/* =====================================================
   script.js - Tabitha Muthoni's portfolio
   1 Setup | 2 Mobile menu | 3 Navbar scroll | 4 Active link
   5 Typing effect | 6 Scroll reveal | 7 Contact form
   ===================================================== */

/* ---------- 1. SETUP ---------- */

// Tell the CSS that JavaScript is working (the reveal animations depend on this)
document.documentElement.classList.add("js");

// Put the current year in the footer automatically
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 2. MOBILE MENU ---------- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Open or close the menu when the hamburger button is clicked
menuToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after a link is clicked
navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 3. NAVBAR SHADOW ON SCROLL ---------- */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  // Add the "scrolled" class once we have scrolled down a little
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

/* ---------- 4. HIGHLIGHT THE ACTIVE NAV LINK ---------- */
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");

// Watches which section is in the middle of the screen
const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

/* ---------- 5. TYPING EFFECT (HOME SECTION) ---------- */
const typedText = document.getElementById("typed-text");
const phrases = ["Information Technology Student", "Beginner Web Learner", "Keen IT Learner"];
let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (deleting) {
    letterIndex--;   // remove one letter
  } else {
    letterIndex++;   // add one letter
  }

  typedText.textContent = currentPhrase.substring(0, letterIndex);

  let speed = deleting ? 50 : 100;

  if (!deleting && letterIndex === currentPhrase.length) {
    deleting = true;   // finished typing: wait, then delete
    speed = 1500;
  } else if (deleting && letterIndex === 0) {
    deleting = false;  // finished deleting: move to next phrase
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

/* ---------- 6. SCROLL REVEAL ANIMATION ---------- */
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible"); // CSS fades it in
        observer.unobserve(entry.target);      // only animate once
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach(function (item) {
  revealObserver.observe(item);
});

/* ---------- 7. CONTACT FORM VALIDATION ---------- */
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("formSuccess");

// Shows an error message under a field and turns its border red
function showError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.parentElement.classList.add("invalid");
  input.parentElement.classList.remove("valid");
}

// Clears the error and turns the border green
function showValid(input, errorId) {
  document.getElementById(errorId).textContent = "";
  input.parentElement.classList.remove("invalid");
  input.parentElement.classList.add("valid");
}

// Each function returns true if the field is OK, false if not
function validateName() {
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, "nameError", "Please enter your name (at least 2 letters).");
    return false;
  }
  showValid(nameInput, "nameError");
  return true;
}

function validateEmail() {
  // A simple pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "emailError", "Please enter a valid email address.");
    return false;
  }
  showValid(emailInput, "emailError");
  return true;
}

function validateMessage() {
  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "messageError", "Your message should be at least 10 characters.");
    return false;
  }
  showValid(messageInput, "messageError");
  return true;
}

// Check each field again when the person leaves it
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
messageInput.addEventListener("blur", validateMessage);

// When the form is submitted
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  formSuccess.textContent = "";

  // Run all three checks (every one runs so all errors show at once)
  const nameOk = validateName();
  const emailOk = validateEmail();
  const messageOk = validateMessage();

  if (nameOk && emailOk && messageOk) {
    // There is no server, so open the visitor's email app with the message filled in
    const subject = encodeURIComponent("Portfolio message from " + nameInput.value.trim());
    const body = encodeURIComponent(
      messageInput.value.trim() + "\n\nFrom: " + nameInput.value.trim() + " (" + emailInput.value.trim() + ")"
    );
    window.location.href = "mailto:tabithamunuhe4@gmail.com?subject=" + subject + "&body=" + body;

    formSuccess.textContent = "Thank you, " + nameInput.value.trim() + "! Your email app should open so you can send the message.";
    form.reset();
    document.querySelectorAll(".form-group").forEach(function (group) {
      group.classList.remove("valid", "invalid");
    });
  }
});
