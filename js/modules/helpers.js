const htmlEl = {
  audioPlayer: document.querySelector('audio'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-button'),
  searchResult: document.querySelector('.search-result'),
  searchLoading: document.querySelector('.songs-loading'),
};


function createSong(songImg, songTitle, songPreview, songArtist) {
  if (songPreview == null) return;
  const songElement = createHTMLElement(`
    <li class='item' data-song-url='${songPreview}'>
      <img src='${songImg}' class='songImg' />
      <div class='item-overlay'>
        <progress class='progress' max='30'></progress>
      </div>
      <p>${songArtist}</p>
      <p>${songTitle}</p>
    </li>
  `)

  htmlEl.searchResult.appendChild(songElement)
}

function createHTMLElement(html) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()

  return template.content.firstElementChild
}

function playSongPreview(e) {
  const audioEl = htmlEl.audioPlayer

  audioEl.src = e.currentTarget.dataset.songUrl
  audioEl.volume = .5
  
  const promise = audioEl.play();
  if (promise !== undefined) {
    promise.then(function() {
      console.log('Audio Playing');
    }).catch(function(error) {
      console.log('Audio Error, play() promise rejected?');
    });
  }
  // console.log(e.currentTarget.childNodes[3].childNodes[1]);
  const progressBar = e.currentTarget.childNodes[3].childNodes[1]
  audioEl.addEventListener('timeupdate', () => {
    progressBar.value = progressBar.max-audioEl.currentTime
  })
}

function stopSongPreview() {
  const audioEl = htmlEl.audioPlayer
  audioEl.src = ''
}

// Disables use of media control keys on keyboard,bt devices etc.
//(https://stackoverflow.com/questions/59347480/disable-media-control-keys-with-javascript)
navigator.mediaSession.setActionHandler("play", function () {});
navigator.mediaSession.setActionHandler("pause", function () {});
navigator.mediaSession.setActionHandler("seekbackward", function () {});
navigator.mediaSession.setActionHandler("seekforward", function () {});
navigator.mediaSession.setActionHandler("previoustrack", function () {});
navigator.mediaSession.setActionHandler("nexttrack", function () {});



export { createSong, htmlEl , playSongPreview, stopSongPreview }