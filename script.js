const tosMarketSnapshot = [
  { symbol: 'SPY', instrument: 'S&P 500 ETF', price: 601.22, change: 1.37 },
  { symbol: 'QQQ', instrument: 'Nasdaq 100 ETF', price: 519.78, change: 0.86 },
  { symbol: 'AAPL', instrument: 'Apple Inc.', price: 238.54, change: -0.49 },
  { symbol: 'NVDA', instrument: 'NVIDIA Corp.', price: 142.63, change: 2.12 },
  { symbol: 'TSLA', instrument: 'Tesla Inc.', price: 214.18, change: -1.14 },
  { symbol: 'AMD', instrument: 'Advanced Micro Devices', price: 173.76, change: 1.04 }
];

const state = {
  billing: 'monthly',
  watchlist: JSON.parse(localStorage.getItem('aether-watchlist') || '[]')
};

const feedRoot = document.getElementById('tos-feed');
const filterInput = document.getElementById('symbol-filter');
const watchSymbolInput = document.getElementById('watch-symbol');
const addWatchBtn = document.getElementById('add-watch-btn');
const watchlistTags = document.getElementById('watchlist-tags');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('site-nav');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const pricingCards = document.querySelectorAll('.price-card');
const waitlistForm = document.getElementById('waitlist-form');
const formMessage = document.getElementById('form-message');
const year = document.getElementById('year');

year.textContent = String(new Date().getFullYear());

const formatChange = (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

function renderFeed(list) {
  if (list.length === 0) {
    feedRoot.innerHTML = '<p class="muted">No symbols match your filter.</p>';
    return;
  }

  feedRoot.innerHTML = list
    .map(
      ({ symbol, instrument, price, change }) => `
        <article class="feed-item">
          <div>
            <strong>${symbol}</strong><br>
            <small>${instrument}</small>
          </div>
          <div class="price">
            <strong>$${price.toFixed(2)}</strong><br>
            <small class="${change >= 0 ? 'up' : 'down'}">${formatChange(change)}</small>
          </div>
        </article>
      `
    )
    .join('');
}

function renderWatchlist() {
  if (!state.watchlist.length) {
    watchlistTags.innerHTML = '<span class="muted">No symbols saved yet.</span>';
    return;
  }

  watchlistTags.innerHTML = state.watchlist.map((symbol) => `<span class="tag">${symbol}</span>`).join('');
}

function persistWatchlist() {
  localStorage.setItem('aether-watchlist', JSON.stringify(state.watchlist));
}

function handleFilter() {
  const filter = filterInput.value.trim().toLowerCase();
  const filteredList = tosMarketSnapshot.filter(({ symbol, instrument }) => {
    return symbol.toLowerCase().includes(filter) || instrument.toLowerCase().includes(filter);
  });

  renderFeed(filteredList);
}

filterInput.addEventListener('input', handleFilter);

addWatchBtn.addEventListener('click', () => {
  const symbol = watchSymbolInput.value.trim().toUpperCase();
  if (!symbol) return;

  if (!state.watchlist.includes(symbol)) {
    state.watchlist.push(symbol);
    state.watchlist.sort();
    persistWatchlist();
    renderWatchlist();
  }

  watchSymbolInput.value = '';
  watchSymbolInput.focus();
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.billing = button.dataset.billing;
    toggleButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    pricingCards.forEach((card) => {
      const value = card.dataset[state.billing];
      const priceValue = card.querySelector('.price-value');
      const priceSuffix = card.querySelector('.price small');
      priceValue.textContent = `$${value}`;
      priceSuffix.textContent = state.billing === 'yearly' ? '/mo (billed yearly)' : '/mo';
    });
  });
});

waitlistForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email || !email.includes('@')) {
    formMessage.textContent = 'Please provide a valid name and email address.';
    formMessage.className = 'form-message error';
    return;
  }

  formMessage.textContent = `Thanks, ${name}. Your early-access request was received.`;
  formMessage.className = 'form-message success';
  waitlistForm.reset();
});

renderFeed(tosMarketSnapshot);
renderWatchlist();
