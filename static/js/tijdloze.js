document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://www.pgm.gent/data/bestof2024/tijdloze.json";

  const songsContainer = document.getElementById("songs");
  const paginationContainer = document.querySelector(".pagination");
  const subNavButtons = document.querySelectorAll(".sub-navigation button");

  let currentPage = 1;
  const itemsPerPage = 20;
  const maxPages = 5;
  let activeFilter = "top";
  let allSongs = [];

  // Fetch JSON data
  async function fetchSongs() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch songs data.");
      allSongs = await response.json();

      // Initialize liked state from localStorage
      const likes = JSON.parse(localStorage.getItem("likedSongs") || "{}");
      allSongs.forEach((song) => {
        song.liked = !!likes[song.song_id];
      });

      renderSongs();
    } catch (error) {
      console.error(error);
    }
  }

  // render songs page
  function renderSongs() {
    const filteredSongs = filterSongs(activeFilter);
    const paginatedSongs = paginate(filteredSongs, currentPage, itemsPerPage);
    songsContainer.innerHTML = "";

    const likes = JSON.parse(localStorage.getItem("likedSongs") || "{}");

    paginatedSongs.forEach((song, index) => {
      const songElement = document.createElement("li");
      songElement.className = "song-item";
      songElement.setAttribute("data-id", song.song_id);

      const positionChange =
        song.position2023 && song.position2024
          ? song.position2023 - song.position2024
          : null;
      const changeIndicator =
        positionChange === null
          ? ""
          : positionChange > 0
          ? `+${positionChange}`
          : `${positionChange}`;

      const isLiked = !!likes[song.song_id];

      songElement.innerHTML = `
          <div class="song-info">
            <span id="position">#${song.position2024 || index + 1}</span>
            <span class="position-change">${changeIndicator}</span>
            <span class="title">${song.song_title}</span>
            <span class="artist">${song.name}</span>
            <span class="album">
              <img src="static/images/icons/album.svg" alt="Album" class="album-icon">${
                song.album_title
              }
            </span>
            <span class="release-year">${song.release_year}</span>
            <button class="like-button">
              <img 
                src="static/images/icons/${
                  isLiked ? "heart-red.svg" : "heart.svg"
                }" 
                alt="Like" 
                class="${isLiked ? "active" : ""}">
            </button>
          </div>
        `;
      songsContainer.appendChild(songElement);
    });

    updatePagination(filteredSongs.length);
  }

  // Filter songs on .active filter
  function filterSongs(filter) {
    const likes = JSON.parse(localStorage.getItem("likedSongs") || "{}");

    switch (filter) {
      case "exits":
        return allSongs.filter(
          (song) => song.position2023 && !song.position2024
        );
      case "new":
        return allSongs.filter(
          (song) => !song.position2023 && song.position2024
        );
      case "liked":
        return allSongs.filter((song) => likes[song.song_id]);
      default:
        return allSongs.filter(
          (song) => song.position2024 && song.position2024 <= 100
        );
    }
  }

  // Like button
  songsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "IMG" && target.closest(".like-button")) {
      const img = target;
      const songId = img.closest(".song-item").getAttribute("data-id");
      const likes = JSON.parse(localStorage.getItem("likedSongs") || "{}");

      const liked = img.classList.toggle("active");
      img.src = liked
        ? "static/images/icons/heart-red.svg"
        : "static/images/icons/heart.svg";

      // Update liked state in localStorage
      if (liked) {
        likes[songId] = true;
      } else {
        delete likes[songId];
      }
      localStorage.setItem("likedSongs", JSON.stringify(likes));
    }
  });

  // Paginate songs
  function paginate(songs, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    return songs.slice(start, start + itemsPerPage);
  }

  // Update pagination
  function updatePagination(totalItems) {
    const totalPages = Math.min(Math.ceil(totalItems / itemsPerPage), maxPages);

    paginationContainer.querySelector("#prev-page").disabled =
      currentPage === 1;
    paginationContainer.querySelector("#next-page").disabled =
      currentPage === totalPages;

    const pageNumbers = paginationContainer.querySelector("#page-numbers");
    pageNumbers.textContent = `Pagina ${currentPage} van ${totalPages}`;
  }

  // Handle pagination
  paginationContainer.addEventListener("click", (e) => {
    if (e.target.id === "prev-page" && currentPage > 1) {
      currentPage--;
      renderSongs();
    } else if (e.target.id === "next-page") {
      currentPage++;
      renderSongs();
    }
  });

  // Handle sub-navigation
  subNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.list;
      currentPage = 1;

      subNavButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      renderSongs();
    });
  });

  fetchSongs();
});