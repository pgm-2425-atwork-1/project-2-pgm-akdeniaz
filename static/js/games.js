//slideshow
document.addEventListener("DOMContentLoaded", () => {
  const regularGameImages = document.querySelectorAll(".regular-game img");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  let currentIndex = 0;

  const updateSlideshow = () => {
    regularGameImages.forEach((img, index) => {
      img.style.display = index === currentIndex ? "block" : "none";
    });
    prevButton.style.display = currentIndex === 0 ? "none" : "inline-flex";
    nextButton.style.display =
      currentIndex === regularGameImages.length - 1 ? "none" : "inline-flex";
  };

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

  updateSlideshow();
});

//fullscreen
document.addEventListener("DOMContentLoaded", () => {
  const honorableImages = document.querySelectorAll(".honorable-mention img");
  const fullscreenOverlay = document.getElementById("fullscreen-overlay");
  const fullscreenImage = document.getElementById("fullscreen-image");
  const fullscreenTitle = document.getElementById("fullscreen-title");
  const closeFullscreen = document.getElementById("close-fullscreen");

  // Open fullscreen overlay
  honorableImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      fullscreenImage.src = img.src;
      fullscreenTitle.textContent = img.alt || "Honorable Mention";
      fullscreenOverlay.classList.add("active");
    });
  });

  // Close fullscreen overlay
  closeFullscreen.addEventListener("click", () => {
    fullscreenOverlay.classList.remove("active");
  });
});
