const search = document.getElementById('gallery-search');
const cards = [...document.querySelectorAll('.graph-card')];
const randomSequence = document.getElementById('random-sequence');
randomSequence.disabled = cards.length === 0;
randomSequence.addEventListener('click', () => {
  const card = cards[Math.floor(Math.random() * cards.length)];
  if (card) window.location.assign(card.href);
});
const count = document.getElementById('gallery-count');
const empty = document.getElementById('gallery-empty');
const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function filter() {
  const query = normalize(search.value);
  let matches = 0;
  for (const card of cards) {
    card.hidden = !normalize(card.dataset.search).includes(query);
    if (!card.hidden) matches++;
  }
  count.textContent = query ? `${matches} of ${cards.length} sequences` : `${cards.length} sequences`;
  empty.hidden = matches > 0;
}
search.addEventListener('input', filter);
document.getElementById('clear-search').addEventListener('click', () => {
  search.value = '';
  filter();
  search.focus();
});
window.addEventListener('pageshow', filter);
filter();
