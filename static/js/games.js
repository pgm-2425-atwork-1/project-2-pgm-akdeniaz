// Slideshow
document.addEventListener("DOMContentLoaded", () => {
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
  });
  
  // Fullscreen function
  document.addEventListener("DOMContentLoaded", () => {
    const gameImages = document.querySelectorAll(".main-games img");
    const fullscreenOverlay = document.getElementById("fullscreen-overlay");
    const fullscreenImage = document.getElementById("fullscreen-image");
    const fullscreenTitle = document.getElementById("fullscreen-title");
    const closeFullscreen = document.getElementById("close-fullscreen");
  
    let currentImageIndex = 0;
  
    // Open fullscreen overlay
    gameImages.forEach((img, index) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        currentImageIndex = index;
        updateFullscreenContent();
        fullscreenOverlay.classList.add("active");
      });
    });
  
    // Close fullscreen overlay
    closeFullscreen.addEventListener("click", () => {
      fullscreenOverlay.classList.remove("active");
    });
  
    // Function to update the fullscreen content
    function updateFullscreenContent() {
      const currentImage = gameImages[currentImageIndex];
      fullscreenImage.src = currentImage.src;
      fullscreenTitle.textContent = currentImage.nextElementSibling.textContent;
    }
  });