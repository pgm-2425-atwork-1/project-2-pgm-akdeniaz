// Switch between dark/light mode
document.querySelector(".theme-icon").addEventListener("click", () => {
  const body = document.body;
  const themeIcon = document.querySelector(".theme-icon");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeIcon.src = "static/images/icons/sun.svg";
    themeIcon.className = "theme-icon moon-mode";
  } else {
    themeIcon.src = "static/images/icons/moon.svg";
    themeIcon.className = "theme-icon sun-mode";
  }
});

// By default, make it dark themed
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeIcon = document.querySelector(".theme-icon");

  body.classList.add("dark-mode");
  themeIcon.src = "static/images/icons/sun.svg";
  themeIcon.className = "theme-icon sun-mode";
});

document.getElementById("hamburger").addEventListener("click", (event) => {
  const navHidden = document.getElementById("nav-hidden");
  navHidden.classList.toggle("visible");
});
