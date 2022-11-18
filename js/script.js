/*TODO
- validation check the input field
- better way of targeting injected html elements per item
- handle mouseover and mouseleave playing/stoping song
- work more on css layout
*/
import { getSongs, htmlEl } from './modules/api.js';

htmlEl.searchBtn.addEventListener('click', async () => {
  htmlEl.searchResult.innerHTML = '';
  if (htmlEl.searchInput.value) {
    htmlEl.searchLoading.classList.toggle('show')
    htmlEl.searchResult.classList.toggle('hide')
    await getSongs(htmlEl.searchInput.value)
  }
});