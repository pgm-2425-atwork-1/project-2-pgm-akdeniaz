// Toggle dark/light mode on click
document.querySelector(".theme-icon").addEventListener("click", () => {
  const body = document.body;
  const themeIcon = document.querySelector(".theme-icon");
  const links = document.querySelectorAll("a");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    // Apply dark mode settings
    themeIcon.src = "static/images/icons/sun.svg";
    themeIcon.className = "theme-icon moon-mode";
    links.forEach((link) => (link.style.color = ""));
    localStorage.setItem("theme", "dark-mode");
  } else {
    // Apply light mode settings
    themeIcon.src = "static/images/icons/moon.svg";
    themeIcon.className = "theme-icon sun-mode";
    links.forEach((link) => (link.style.color = "black"));
    localStorage.setItem("theme", "light-mode");
  }
});

// Load saved theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeIcon = document.querySelector(".theme-icon");
  const savedTheme = localStorage.getItem("theme");
  const links = document.querySelectorAll("a");

  if (savedTheme === "dark-mode") {
    // Load dark mode
    body.classList.add("dark-mode");
    themeIcon.src = "static/images/icons/sun.svg";
    themeIcon.className = "theme-icon moon-mode";
    links.forEach((link) => (link.style.color = ""));
  } else {
    // Load light mode
    body.classList.remove("dark-mode");
    themeIcon.src = "static/images/icons/moon.svg";
    themeIcon.className = "theme-icon sun-mode";
    links.forEach((link) => (link.style.color = "black"));
  }
});

// Toggle mobile nav visibility
document.getElementById("hamburger").addEventListener("click", () => {
  const navHidden = document.getElementById("nav-hidden");
  navHidden.classList.toggle("visible");
});

// PREV <=> NEXT BUTTONS
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const currentPage = window.location.pathname.split("/").pop();
  
  // Find the current page index
  const currentIndex = navLinks.findIndex((link) => link.getAttribute("href") === currentPage);

  // Get the previous and next pages
  const prevPage = currentIndex > 0 ? navLinks[currentIndex - 1].getAttribute("href") : null;
  const nextPage = currentIndex < navLinks.length - 1 ? navLinks[currentIndex + 1].getAttribute("href") : null;

  // Update the buttons
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  if (prevPage) {
    prevButton.addEventListener("click", () => {
      window.location.href = prevPage;
    });
  } else {
    prevButton.style.display = "none";
  }

  if (nextPage) {
    nextButton.addEventListener("click", () => {
      window.location.href = nextPage;
    });
  } else {
    nextButton.style.display = "none";
  }
});
