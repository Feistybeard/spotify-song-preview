/*TODO
- validation check the input field
- better handling of adding and removing html elements
- better way of targeting injected html elements per item
- resarch on media audio player element and how many of theme can exist (createSong function), also https://bugs.chromium.org/p/chromium/issues/detail?id=1144736#c27
- work more on css layout
*/

const TOKEN_URL = "https://blooming-reef-63913.herokuapp.com/api/token";
const EP_SEARCH = "https://api.spotify.com/v1/search/";
const EP_GET_ARTIST_TOP_TRACKS = "https://api.spotify.com/v1/artists/";
const EP_GET_TRACKS = "https://api.spotify.com/v1/tracks/?ids=";
let createdTopSongs = [];

const htmlEl = {
  searchInput: document.querySelector(".search-input"),
  searchRadio1: document.querySelector(".search-radio-1"),
  searchRadio2: document.querySelector(".search-radio-2"),
  searchBtn: document.querySelector(".search-button"),
  searchResult: document.querySelector(".search-result"),
  searchLoading: document.querySelector(".songs-loading"),
};

async function getSpotifyToken() {
  try {
    const res = await fetch(TOKEN_URL);
    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error(error);
  }
}
// getSpotifyToken();
// getTrack('Lucky');
// getArtist('Daft Punk');

async function createSongs(...trackId) {
  const songsIdArr = [];
  trackId[0].forEach((e) => {
    songsIdArr.push(e.id);
    // htmlEl.searchResult.innerHTML += `<li>${e.id}</li>`
  });

  const songsId = [...songsIdArr].toString().split(" ");
  const token = await getSpotifyToken();
  const res = await fetch(`${EP_GET_TRACKS}${songsId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  // console.log(data);
}

function createSong(songId, songImg, songTitle, songPreview, artistName) {
  if (songPreview == null) return;
  htmlEl.searchResult.innerHTML += `<li class='item play_cursor'><audio><source src='${songPreview}' type='audio/mpeg' /></audio><img src='${songImg}' class='songImg' /><div class="item-overlay">
  <progress class="progress" max="30"></progress></div><p>${artistName}</p><p>${songTitle}</p></li>`;

  const allSongs = document.querySelectorAll(".item");
  allSongs.forEach((song) => {
    song.addEventListener("mouseover", playSongPreview);
    song.addEventListener("mouseleave", stopSongPreview);
  });
}

async function getTopSongs(artistId) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `${EP_GET_ARTIST_TOP_TRACKS}${artistId}/top-tracks?market=SE`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  // createSongs(data.tracks)
  const songsIdArr = [];
  data.tracks.forEach((e) => {
    createSong(0, e.album.images[1].url, e.name, e.preview_url);
  });
  const allSongImgs = document.querySelectorAll(".item");
  allSongImgs.forEach((songImg) => {
    songImg.addEventListener("mouseover", playSongPreview);
    songImg.addEventListener("mouseleave", stopSongPreview);
  });
  console.log(data);
}

async function getTrack(query) {
  const token = await getSpotifyToken();
  const res = await fetch(`${EP_SEARCH}?q=${query}&type=track`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
}

async function getArtist(query) {
  const token = await getSpotifyToken();
  const res = await fetch(`${EP_SEARCH}?q=${query}&type=track,artist,albuma&limit=50`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log(data);
  // data.artists.items.forEach((e) => {
    data.tracks.items.forEach((e) => {
      // console.log(e);
      if (e.name.toLowerCase() === query.toLowerCase() || e.artists[0].name.toLowerCase() === query.toLowerCase()) {
        getTopSongs(e.id);
    };
  })
}

async function getSongs(query) {
  const token = await getSpotifyToken();
  let chromeBugFix = null;
  (window.navigator.userAgent.toLowerCase().match(/chrome|chromium|crios/i)) ? chromeBugFix = 40 : chromeBugFix = 50;
  //https://bugs.chromium.org/p/chromium/issues/detail?id=1144736#c27
  const res = await fetch(`${EP_SEARCH}?q=${query}&type=track,artist,album&limit=${chromeBugFix}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  // console.log(data);
  data.tracks.items.forEach((e) => {
    // console.log(e);
    createSong(0, e.album.images[1].url, e.name, e.preview_url, e.artists[0].name)
  })
  setTimeout(() => {
    htmlEl.searchLoading.classList.toggle('show')
    htmlEl.searchResult.classList.toggle('hide')
  }, 1000);
}

function playSongPreview(e) {
  // 0 - audio / 1 - img / 2 - overlay / 3 - p
  // console.log(e.currentTarget.childNodes[0])
  e.currentTarget.childNodes[0].volume = 0.5;
  // console.log("Playing: ", e.currentTarget.childNodes[3].outerText);
  e.currentTarget.childNodes[0].play();
  const el = e.currentTarget.childNodes[0];
  const progressBar = e.currentTarget.childNodes[2].childNodes[1];
  // progressBar.max = el.duration;
  e.currentTarget.childNodes[0].addEventListener('timeupdate', () => {
    progressBar.value = progressBar.max-el.currentTime;
  })
}

function stopSongPreview(e) {
  e.currentTarget.childNodes[0].pause();
  e.currentTarget.childNodes[0].currentTime = null;
}

htmlEl.searchBtn.addEventListener("click", (e) => {
  htmlEl.searchResult.innerHTML = "";
  // if (htmlEl.searchRadio1.checked) getSongs(htmlEl.searchInput.value);
  // if (htmlEl.searchRadio2.checked) return;
  if (htmlEl.searchInput.value) {
    htmlEl.searchLoading.classList.toggle('show')
    htmlEl.searchResult.classList.toggle('hide')
    getSongs(htmlEl.searchInput.value)
  }
});

// Disables use of media control keys on keyboard,bt devices etc.
//(https://stackoverflow.com/questions/59347480/disable-media-control-keys-with-javascript)
navigator.mediaSession.setActionHandler("play", function () {});
navigator.mediaSession.setActionHandler("pause", function () {});
navigator.mediaSession.setActionHandler("seekbackward", function () {});
navigator.mediaSession.setActionHandler("seekforward", function () {});
navigator.mediaSession.setActionHandler("previoustrack", function () {});
navigator.mediaSession.setActionHandler("nexttrack", function () {});
