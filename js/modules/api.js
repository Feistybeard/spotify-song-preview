import { createSong, htmlEl , playSongPreview, stopSongPreview } from "./helpers.js";

const TOKEN_URL = 'https://blooming-reef-63913.herokuapp.com/api/token';
const EP_SEARCH = 'https://api.spotify.com/v1/search/';
let TOKEN = '';


async function getSpotifyToken() {
  try {
    const res = await fetch(TOKEN_URL);
    const data = await res.json();
    TOKEN = data.token;
    // return data.token;
  } catch (error) {
    console.error(error);
  }
}

async function getSongs(query) {
  // const token = await getSpotifyToken();
  const res = await fetch(`${EP_SEARCH}?q=${query}&type=track,artist,album&limit=50`, {
    headers: {
      authorization: `Bearer ${TOKEN}`,
    },
  });
  const data = await res.json();
  // console.log(data);
  data.tracks.items.forEach((e) => {
    createSong(e.album.images[1].url, e.name, e.preview_url, e.artists[0].name)
  })
  htmlEl.searchLoading.classList.toggle('show')
  htmlEl.searchResult.classList.toggle('hide')

  const allSongs = document.querySelectorAll(".item");
  
  allSongs.forEach((song) => {
    song.addEventListener("mouseover", playSongPreview);
    song.addEventListener("mouseleave", stopSongPreview);
  });
}

getSpotifyToken();

export { getSongs, htmlEl }