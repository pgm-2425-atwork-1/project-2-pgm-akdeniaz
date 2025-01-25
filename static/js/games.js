// Fetch and Render Games Content
document.addEventListener("DOMContentLoaded", () => {
  const gamesUrl = "https://www.pgm.gent/data/bestof2024/games.json";

  fetch(gamesUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      renderGames(data);
    })
    .catch((error) => {
      console.error("Error fetching games data:", error);
    });
});

// Render Games Function
function renderGames(games) {
  const regularGamesContainer = document.querySelector(
    ".regular-games-container"
  );
  const honorableMentionsContainer = document.querySelector(
    ".honorable-mentions-container"
  );

  const regularGames = games.filter((game) => !game.honorable_mentions);
  regularGames.forEach((game) => {
    const article = createGameArticle(game, "regular-game");
    regularGamesContainer.appendChild(article);
  });

  const honorableGames = games.filter((game) => game.honorable_mentions);
  honorableGames.forEach((game) => {
    const article = createGameArticle(game, "honorable-mention");
    honorableMentionsContainer.appendChild(article);
  });

  initializeSlideshow();
  initializeFullscreen();
}

// Create Game Article
function createGameArticle(game, className) {
  const article = document.createElement("article");
  article.className = className;

  const img = document.createElement("img");
  img.src = game.image;
  img.className = `game__img`;
  img.alt = game.title;

  const title = document.createElement("h3");
  title.textContent = game.title;
  title.className = "game__title";

  article.appendChild(img);
  article.appendChild(title);

  return article;
}

// Slideshow
function initializeSlideshow() {
  const regularGameImages = document.querySelectorAll(".regular-game img");
  const titles = document.querySelectorAll(".regular-game .game__title");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const dotsContainer = document.getElementById("dots-container");

  let currentIndex = 0;

  // Create dots
  const createDots = () => {
    dotsContainer.innerHTML = "";
    regularGameImages.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (index === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlideshow();
      });
      dotsContainer.appendChild(dot);
    });
  };

  // Update slideshow and dot navigation
  const updateSlideshow = () => {
    regularGameImages.forEach((img, index) => {
      img.style.display = index === currentIndex ? "block" : "none";
      titles[index].style.display = index === currentIndex ? "block" : "none";
    });

    // Update dot states
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    // Show/hide navigation buttons
    prevButton.style.display = currentIndex === 0 ? "none" : "inline-flex";
    nextButton.style.display =
      currentIndex === regularGameImages.length - 1 ? "none" : "inline-flex";
  };

  // Event listeners for navigation buttons
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlideshow();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < regularGameImages.length - 1) {
      currentIndex++;
      updateSlideshow();
    }
  });

  createDots();
  updateSlideshow();
}

// Fullscreen
function initializeFullscreen() {
  const honorableImages = document.querySelectorAll(".honorable-mention img");
  const fullscreenOverlay = document.getElementById("fullscreen-overlay");
  const fullscreenImage = document.getElementById("fullscreen-image");
  const fullscreenTitle = document.getElementById("fullscreen-title");
  const closeFullscreen = document.getElementById("close-fullscreen");

  honorableImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      fullscreenImage.src = img.src;
      fullscreenTitle.textContent = img.alt || "Honorable Mention";
      fullscreenOverlay.classList.add("active");
    });
  });

  closeFullscreen.addEventListener("click", () => {
    fullscreenOverlay.classList.remove("active");
  });
}
