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
  const prevButton = document.querySelector(".navigation__prev");
  const nextButton = document.querySelector(".navigation__next");

  // prev-button
  if (prevButton) {
    prevButton.style.display = "inline-flex";
  } else {
    console.warn("Previous button not found.");
  }

  // next-button
  if (nextButton) {
    nextButton.style.display = "inline-flex";
  } else {
    console.warn("Next button not found.");
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

  const genreContainer = document.createElement("div");
  genreContainer.className = "genre-container";

  if (media.genre && Array.isArray(media.genre)) {
    media.genre.forEach((g) => {
      const genreTag = document.createElement("span");
      genreTag.className = "genre";
      genreTag.textContent = g;
      genreContainer.appendChild(genreTag);
    });
  }

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
  article.appendChild(genreContainer);
  article.appendChild(linksContainer);

  return article;
}

document.addEventListener("DOMContentLoaded", () => {
  // Slideshow functionaliteit
  const slideshowImages = document.querySelectorAll(".main-games > div img");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  let currentIndex = 0;

  const updateSlideshow = () => {
    slideshowImages.forEach((img, index) => {
      img.style.display = index === currentIndex ? "block" : "none";
    });
    prevButton.style.display = currentIndex === 0 ? "none" : "inline-flex";
    nextButton.style.display =
      currentIndex === slideshowImages.length - 1 ? "none" : "inline-flex";
  };

  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      updateSlideshow();
    }
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentIndex < slideshowImages.length - 1) {
      currentIndex++;
      updateSlideshow();
    }
  });

  updateSlideshow();

  // Fullscreen functionaliteit
  const honorableImages = document.querySelectorAll(
    "section:nth-of-type(2) div img"
  );

  honorableImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      if (img.requestFullscreen) {
        img.requestFullscreen();
      } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen();
      } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen();
      }
    });
  });
});
