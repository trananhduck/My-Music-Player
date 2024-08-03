const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const seekBar = document.getElementById("seek-bar");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");
const defaultAlbumArt = "./path/to/default-album-art.jpg"; // Default album art image path

const allSongs = [
  {
    id: 0,
    title: "Buông Đôi Drill Nhau Ra (prod by yungijin)",
    artist: "Sơn Tùng M-TP",
    duration: "3:13",
    src: "./assest/music/song1.mp3",
    albumArt: './assest/img/pic1.jpg'
  },
  {
    id: 1,
    title: "Có Tất Cả Nhưng Thiếu Drill (prod by AMaj7ing)",
    artist: "Erik",
    duration: "4:44",
    src: "./assest/music/song2.mp3",
    albumArt: './assest/img/pic2.jpg'
  },
  {
    id: 2,
    title: "Forget About Drill (prod by AMaj7ing)",
    artist: "Justa Tee",
    duration: "3:21",
    src: "./assest/music/song3.mp3",
    albumArt: './assest/img/pic3.jpg'
  },
  {
    id: 3,
    title: "Hết Drill Cạn Nhớ x Níu Drill (prod by AMaj7ing)",
    artist: "Lê Bảo Bình x Đức Phúc",
    duration: "8:21",
    src: "./assest/music/song4.mp3",
    albumArt: './assest/img/pic4.jpg'
  },
  {
    id: 4,
    title: "Nothing In Your Drill (prod by AMaj7ing)",
    artist: "Touliver, Bảo Thy, Yanbi, Mr.T ",
    duration: "3:16",
    src: "./assest/music/song5.mp3",
    albumArt: './assest/img/pic5jpg'
  },
  {
    id: 5,
    title: "Bông Drill Đẹp Nhất (prod by Headiebeatz)",
    artist: "Quân A.P",
    duration: "4:10",
    src: "./assest/music/song6.mp3",
    albumArt: './assest/img/pic6.jpg'
  },
  {
    id: 6,
    title: "Tình Drill Vĩ Mô (prod by AMaj7ing)",
    artist: "Wren Evans",
    duration: "2:14",
    src: "./assest/music/song7.mp3",
    albumArt: './assest/img/pic7.jpg'
  },
  {
    id: 7,
    title: "Vài Lần Đóng Drill (prod by AMaj7ing)",
    artist: "Soobin Hoàng Sơn",
    duration: "2:29",
    src: "./assest/music/song8.mp3",
    albumArt: './assest/img/pic8.jpg'
  },
  {
    id: 8,
    title: "Đừng Làm Trái Tim Anh Drill x Sao Anh Chưa Drill x FEIN! (prod by AMaj7ing)",
    artist: "Sơn Tùng M-TP x Amee x Travis Scott",
    duration: "3:29",
    src: "./assest/music/song9.mp3",
    albumArt: './assest/img/pic9.jpg'
  },
  {
    id: 9,
    title: "Màu Nước Mắt Drill (prod by AMaj7ing)",
    artist: "Nguyễn Trần Trung Quân ",
    duration: "3:31",
    src: "./assest/music/song10.mp3",
    albumArt: './assest/img/pic10.jpg'
  },
];


const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  updateAlbumArt(song?.id);
  audio.play();
};
const updateAlbumArt = (songId) => {
  const albumArtElement = document.getElementById("player-album-art");
  const song = userData?.songs.find((song) => song.id === songId);
  if (song) {
    albumArtElement.innerHTML = `<img src="./assest/img/pic${song.id + 1}.jpg" alt="${song.title} album art">`;
  } else {
    albumArtElement.innerHTML = `<img src="${defaultAlbumArt}" alt="Default album art">`;
  }
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];
    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  if (userData?.currentSong === null) return;
  const currentSongIndex = getCurrentSongIndex();
  const previousSong = userData?.songs[currentSongIndex - 1];
  playSong(previousSong.id);
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
  }
  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd"/></svg>
        </button>
      </li>
      `;
    })
    .join("");
  playlistSongs.innerHTML = songsHTML;
};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

const sortSongs = () => {
  userData?.songs.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();

// Seek bar functionality
audio.addEventListener("timeupdate", () => {
  const value = (audio.currentTime / audio.duration) * 100;
  seekBar.value = value;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener("input", () => {
  const time = (seekBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

audio.addEventListener("loadedmetadata", () => {
  durationSpan.textContent = formatTime(audio.duration);
});

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
