// swtich between dark/ light mode
document.getElementById("theme-icon").addEventListener("click", () => {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeIcon.src = "static/images/icons/sun.svg";
    themeIcon.className = "moon-mode";
  } else {
    themeIcon.src = "static/images/icons/moon.svg";
    themeIcon.className = "sun-mode";
  }
});

// by default makes it dark themed
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

  body.classList.add("dark-mode");
  themeIcon.src = "static/images/icons/sun.svg";
  themeIcon.className = "sun-mode";
});

document.getElementById("hamburger").addEventListener("click", (event) => {
  const navHidden = document.getElementById("nav-hidden");
  navHidden.classList.toggle("visible");
});
