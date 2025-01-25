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
const hamburgerIcon = document.querySelector(".hamburger-icon");
const closeIcon = document.querySelector(".close-icon");

// Toggle the nav visibility and switch icons
hamburger.addEventListener("click", () => {
  nav.classList.toggle("visible");
  hamburger.classList.toggle("active");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1120) {
    nav.classList.remove("visible");
    hamburger.classList.remove("active");
    hamburgerIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }
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

// PREV <=> NEXT LINKS
document.addEventListener("DOMContentLoaded", () => {
  const prevLink = document.querySelector(".navigation__prev");
  const nextLink = document.querySelector(".navigation__next");

  // prev-link
  if (prevLink) {
    prevLink.style.display = "inline-flex";
  }
  // next-link
  if (nextLink) {
    nextLink.style.display = "inline-flex";
  }
});

// URLs for JSON data
const albumsUrl = "https://www.pgm.gent/data/bestof2024/albums.json";
const filmsUrl = "https://www.pgm.gent/data/bestof2024/movies.json";
const gamesUrl = "https://www.pgm.gent/data/bestof2024/games.json";
const seriesUrl = "https://www.pgm.gent/data/bestof2024/series.json";

// Fetch content from external link
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

// Format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "long", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

// Fetch and render content
function fetchAndRenderContent(url, containerId) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      renderMedia(containerId, data);
    })
    .catch((error) => {
      console.error(`Error fetching content from ${url}:`, error);
    });
}

//  Render media
function renderMedia(containerId, mediaArray) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  mediaArray.forEach((media) => {
    const article = createMediaArticle(media);
    container.appendChild(article);
  });
}

// Create a media article
function createMediaArticle(media) {
  const currentPage = window.location.pathname.split("/").pop();
  const page = currentPage.replace(".html", "");

  const article = document.createElement("article");
  article.className = `${page}__article`;

  // Common elements for all pages
  const img = document.createElement("img");
  img.src = media.image || "placeholder.jpg";
  img.alt = media.title || "Media Item";
  img.className = `${page}__img`;

  const h2 = document.createElement("h2");
  h2.textContent = media.title || "Untitled";
  h2.className = `${page}__title`;

  article.appendChild(img);
  article.appendChild(h2);

  // Page-specific content
  if (page === "albums") {
    if (media.release_date) {
      const releaseDate = document.createElement("p");
      releaseDate.textContent = formatDate(media.release_date);
      releaseDate.className = `${page}__release-date`;
      article.appendChild(releaseDate);
    }
    if (media.genre && Array.isArray(media.genre)) {
      const genreContainer = document.createElement("div");
      genreContainer.className = `${page}__genre-container`;

      media.genre.forEach((genre) => {
        const genreTag = document.createElement("span");
        genreTag.className = `${page}__genre`;
        genreTag.textContent = genre;
        genreContainer.appendChild(genreTag);
      });

      article.appendChild(genreContainer);
    }
  } else if (page === "films") {
    if (media.short_description) {
      const description = document.createElement("p");
      description.innerHTML = media.short_description;
      description.className = `${page}__description`;
      article.appendChild(description);
    }

    const linksContainer = document.createElement("div");
    linksContainer.className = `${page}__links-container`;

    if (media.trailer_link) {
      const trailerLink = document.createElement("a");
      trailerLink.href = media.trailer_link;
      trailerLink.textContent = "Trailer";
      trailerLink.target = "_blank";
      trailerLink.className = `${page}__trailer-link`;
      linksContainer.appendChild(trailerLink);
    }

    if (media.imdb_link) {
      const imdbLink = document.createElement("a");
      imdbLink.href = media.imdb_link;
      imdbLink.textContent = "IMDB";
      imdbLink.target = "_blank";
      imdbLink.className = `${page}__imdb-link`;
      linksContainer.appendChild(imdbLink);
    }

    article.appendChild(linksContainer);
  } else if (page === "series") {
    if (media.platform) {
      const platform = document.createElement("p");
      platform.textContent = media.platform;
      platform.className = `${page}__platform`;

      const platformLink = document.createElement("a");
      platformLink.href = getPlatformUrl(media.platform);
      platformLink.target = "_blank";
      platformLink.appendChild(platform);

      article.appendChild(platformLink);
    }

    if (media.short_description) {
      const description = document.createElement("p");
      description.innerHTML = media.short_description;
      description.className = `${page}__short_description`;
      article.appendChild(description);
    }

    const linksContainer = document.createElement("div");
    linksContainer.className = `${page}__links-container`;

    if (media.trailer_link) {
      const trailerLink = document.createElement("a");
      trailerLink.href = media.trailer_link;
      trailerLink.textContent = "Trailer";
      trailerLink.target = "_blank";
      trailerLink.className = `${page}__trailer-link`;
      linksContainer.appendChild(trailerLink);
    }

    if (media.imdb_link) {
      const imdbLink = document.createElement("a");
      imdbLink.href = media.imdb_link;
      imdbLink.textContent = "IMDB";
      imdbLink.target = "_blank";
      imdbLink.className = `${page}__imdb-link`;
      linksContainer.appendChild(imdbLink);
    }

    article.appendChild(linksContainer);
  } else if (page === "games") {
    if (media.honorable_mentions) {
      article.className = "honorable-mention";
    } else {
      article.className = "regular-game";
    }
  }

  return article;

  // Platform URLs
  function getPlatformUrl(platform) {
    switch (platform.toLowerCase()) {
      case "netflix":
        return "https://www.netflix.com/";
      case "hbo":
        return "https://www.hbo.com/";
      case "hbo max":
        return "https://hbo.max.com/";
      case "disney+":
        return "https://www.disneyplus.com/";
      case "prime":
        return "https://www.primevideo.com/";
      case "apple tv+":
        return "https://tv.apple.com/";
      default:
        return "#";
    }
  }
}
