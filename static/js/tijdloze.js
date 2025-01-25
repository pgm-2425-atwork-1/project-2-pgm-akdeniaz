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
        song.liked = Boolean(likes[song.song_id]);
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

    paginatedSongs.forEach((song, index) => {
      const songElement = document.createElement("li");
      songElement.className = "song-item";
      songElement.setAttribute("data-id", song.song_id);

      const changeIndicator =
        activeFilter === "top"
          ? song.position2023 && song.position2024
            ? song.position2023 - song.position2024 > 0
              ? `+${song.position2023 - song.position2024}`
              : `${song.position2023 - song.position2024}`
            : ""
          : activeFilter === "exits"
          ? "2023"
          : "";

      songElement.innerHTML = `
        <div class="song-info">
          <span id="position">${
            song.displayPosition || song.position2024 || index
          }</span>
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
                song.liked ? "heart-red.svg" : "heart.svg"
              }" 
              alt="Like" 
              class="${song.liked ? "active" : ""}">
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
      case "top":
        return allSongs
          .filter((song) => song.position2024 && song.position2024 <= 100)
          .sort((a, b) => a.position2024 - b.position2024)
          .map((song, index) => ({
            ...song,
            displayPosition: index + 1,
          }));
      case "exits":
        return allSongs
          .filter(
            (song) =>
              song.position2023 &&
              (!song.position2024 || song.position2024 > 100)
          )
          .sort((a, b) => a.position2023 - b.position2023)
          .map((song) => ({
            ...song,
            displayChange: "2023",
          }));
      case "new":
        return allSongs
          .filter((song) => {
            const neverInTop = ![...Array(2024 - 1987)]
              .map((_, i) => `position${1987 + i}`)
              .some((key) => song[key] && song[key] <= 100);

            return song.position2024 && song.position2024 <= 100 && neverInTop;
          })
          .sort((a, b) => a.position2024 - b.position2024)
          .map((song) => ({
            ...song,
            displayChange: "",
          }));

      case "liked":
        return allSongs.filter((song) => likes[song.song_id]);

      default: // "top"
        return allSongs
          .filter((song) => song.position2024 && song.position2024 <= 100)
          .sort((a, b) => a.position2024 - b.position2024);
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
