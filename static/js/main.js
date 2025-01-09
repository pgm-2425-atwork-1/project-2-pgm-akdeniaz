// .active a
const currentPath = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".nav-list a");

navLinks.forEach((link) => {
  const linkPath = link.getAttribute("href");

  if (linkPath === currentPath) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Toggle mobile nav visibility
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav-list");

// Toggle the nav visibility on hamburger click
hamburger.addEventListener("click", () => {
  nav.classList.toggle("visible");
});

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

// PREV <=> NEXT BUTTONS
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const currentPage = window.location.pathname.split("/").pop();

  const currentIndex = navLinks.findIndex(
    (link) => link.getAttribute("href") === currentPage
  );

  const prevPage =
    currentIndex > 0 ? navLinks[currentIndex - 1].getAttribute("href") : null;
  const nextPage =
    currentIndex < navLinks.length - 1
      ? navLinks[currentIndex + 1].getAttribute("href")
      : null;

  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  if (prevPage) {
    prevButton.href = prevPage;
  } else {
    prevButton.style.display = "none";
  }

  if (nextPage) {
    nextButton.href = nextPage;
  } else {
    nextButton.style.display = "none";
  }
});

// URLs for JSON data
const albumsUrl = "https://www.pgm.gent/data/bestof2024/albums.json";
const filmsUrl = "https://www.pgm.gent/data/bestof2024/movies.json";
const gamesUrl = "https://www.pgm.gent/data/bestof2024/games.json";
const seriesUrl = "https://www.pgm.gent/data/bestof2024/series.json";

// Fetch and render content from external link
if (document.querySelector(".main-albums")) {
  fetchAndRenderContent(albumsUrl, "album-section");
}
if (document.querySelector(".main-films")) {
  fetchAndRenderContent(filmsUrl, "films-section");
}
if (document.querySelector(".main-games")) {
  fetchAndRenderContent(gamesUrl, "games-section");
}
if (document.querySelector(".main-series")) {
  fetchAndRenderContent(seriesUrl, "series-section");
}

// format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "long", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

// fetch and render content
function fetchAndRenderContent(url, containerId) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderMedia(containerId, data);
    })
    .catch((error) =>
      console.error(`Error fetching content from ${url}:`, error)
    );
}

// Function to render media
function renderMedia(containerId, mediaArray) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  mediaArray.forEach((media) => {
    const article = createMediaArticle(media);
    container.appendChild(article);
  });
}

// Function to create a media article
function createMediaArticle(media) {
  const article = document.createElement("article");

  const img = document.createElement("img");
  img.src = media.image;
  img.alt = media.title;

  const h2 = document.createElement("h2");
  h2.textContent = media.title;

  const description = document.createElement("p");
  description.innerHTML = media.short_description || "";

  const genre = document.createElement("p");
  genre.className = "genre";
  genre.innerHTML = media.genre || "";

  const linksContainer = document.createElement("div");
  if (media.trailer_link) {
    const trailerLink = document.createElement("a");
    trailerLink.href = media.trailer_link;
    trailerLink.textContent = "Trailer";
    trailerLink.target = "_blank";
    linksContainer.appendChild(trailerLink);
  }

  if (media.imdb_link) {
    const imdbLink = document.createElement("a");
    imdbLink.href = media.imdb_link;
    imdbLink.textContent = "IMDB";
    imdbLink.target = "_blank";
    linksContainer.appendChild(imdbLink);
  }

  if (media.release_date) {
    const releaseDate = document.createElement("p");
    releaseDate.textContent = formatDate(media.release_date);
    linksContainer.appendChild(releaseDate);
  }

  article.appendChild(img);
  article.appendChild(h2);
  article.appendChild(description);
  article.appendChild(genre);
  article.appendChild(linksContainer);

  return article;
}
