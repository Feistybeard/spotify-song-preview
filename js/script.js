const TOKEN_URL = "https://blooming-reef-63913.herokuapp.com/api/token";
const EP_SEARCH = "https://api.spotify.com/v1/search/";
const EP_GET_ARTIST_TOP_TRACKS = "https://api.spotify.com/v1/artists/";
const EP_GET_TRACKS = "https://api.spotify.com/v1/tracks/?ids=";
let createdTopSongs = [];

const htmlEl = {
  searchInput: document.querySelector(".search-input"),
  searchRadio1: document.querySelector("search-radio-1"),
  searchRadio2: document.querySelector("search-radio-2a"),
  searchBtn: document.querySelector(".search-button"),
  searchResult: document.querySelector(".search-result"),
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
  trackId[0].forEach(e => {
    songsIdArr.push(e.id);
    // htmlEl.searchResult.innerHTML += `<li>${e.id}</li>`
  });
  
  const songsId = [...songsIdArr].toString().split(' ');
  const token = await getSpotifyToken();
  const res = await fetch(`${EP_GET_TRACKS}${songsId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  // console.log(data);
}

function createSong(songId, songImg, songTitle, songPreview) {
  htmlEl.searchResult.innerHTML += `<li><audio><source src='${songPreview}' type='audio/mpeg' /></audio><img src='${songImg}' class='songImg' /><p>${songTitle}</p></li>`
}

async function getTopSongs(artistId) {
  const token = await getSpotifyToken();
  const res = await fetch(`${EP_GET_ARTIST_TOP_TRACKS}${artistId}/top-tracks?market=SE`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
  });
  const data = await res.json();
  // createSongs(data.tracks)
  const songsIdArr = [];
  data.tracks.forEach(e => {
    createSong(0, e.album.images[1].url, e.name, e.preview_url);
  });
  const allSongImgs = document.querySelectorAll('.songImg')
  allSongImgs.forEach(songImg => {
    songImg.addEventListener('mouseover', playSongPreview);
    songImg.addEventListener('mouseleave', stopSongPreview);
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
  const res = await fetch(`${EP_SEARCH}?q=${query}&type=artist`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  data.artists.items.forEach((e) => {
    if (e.name.toLowerCase() === query.toLowerCase()) {
      getTopSongs(e.id);
    }
  });
}

function playSongPreview(e) {
  console.log('Playing: ', e.currentTarget.nextElementSibling.outerText);
  e.currentTarget.previousElementSibling.play();
}

function stopSongPreview(e) {
  e.currentTarget.previousElementSibling.pause();
  e.currentTarget.previousElementSibling.currentTime=null;
}

htmlEl.searchBtn.addEventListener("click", (e) => {
  getArtist(htmlEl.searchInput.value);
});