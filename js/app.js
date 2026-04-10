import { fetchItems } from './dataService.js';
import { renderCards, renderSummary, renderHighlight, renderStatusText } from './dom.js';

const state = {
  allItems: [],
  filteredItems: []
};

const elements = {
  navSearchInput: document.querySelector('.nav-search input'),
  heroSearchInput: document.querySelector('.hero-search input'),
  heroSearchButton: document.querySelector('.hero-search button'),
  locationFilter: document.querySelector('[name="locationFilter"]'),
  categoryFilter: document.querySelector('[name="categoryFilter"]'),
  statusFilter: document.querySelector('[name="Status"]'),
  sortByFilter: document.querySelector('[name="SortBy"]'),
  grid: document.querySelector('.grid'),
  summary: document.querySelector('#summaryCards'),
  resultCount: document.querySelector('#resultCount'),
  latestHighlights: document.querySelector('#latestHighlights')
};

function getSelectedKeyword() {
  return elements.heroSearchInput.value.trim() || elements.navSearchInput.value.trim();
}

function syncSearchInputs(source) {
  const value = source.value;
  if (source !== elements.heroSearchInput) elements.heroSearchInput.value = value;
  if (source !== elements.navSearchInput) elements.navSearchInput.value = value;
}

function getSummary(items) {
  return items.reduce(
    (accumulator, item) => {
      accumulator.total += 1;
      accumulator[item.status.toLowerCase()] += 1;
      accumulator.uniqueLocations.add(item.location);
      return accumulator;
    },
    { total: 0, lost: 0, found: 0, uniqueLocations: new Set() }
  );
}

function sortItems(items, sortBy) {
  const sortedItems = [...items];
  sortedItems.sort((firstItem, secondItem) => {
    const firstDate = new Date(firstItem.date);
    const secondDate = new Date(secondItem.date);
    return sortBy === 'Oldest first' ? firstDate - secondDate : secondDate - firstDate;
  });
  return sortedItems;
}

function applyFilters() {
  const keyword = getSelectedKeyword();
  const location = elements.locationFilter.value;
  const category = elements.categoryFilter.value;
  const status = elements.statusFilter.value;
  const sortBy = elements.sortByFilter.value;

  const filtered = state.allItems.filter((item) => {
    return item.matchesKeyword(keyword)
      && item.matchesLocation(location)
      && item.matchesCategory(category)
      && item.matchesStatus(status);
  });

  state.filteredItems = sortItems(filtered, sortBy);
  const summary = getSummary(state.filteredItems);

  renderSummary(elements.summary, {
    total: summary.total,
    lost: summary.lost,
    found: summary.found,
    locations: summary.uniqueLocations.size
  });
  renderCards(elements.grid, state.filteredItems);
  renderHighlight(elements.latestHighlights, state.filteredItems.slice(0, 3));
  renderStatusText(elements.resultCount, state.filteredItems.length);
}

function bindEvents() {
  [elements.locationFilter, elements.categoryFilter, elements.statusFilter, elements.sortByFilter]
    .forEach((selectElement) => {
      selectElement.addEventListener('change', applyFilters);
    });

  [elements.navSearchInput, elements.heroSearchInput].forEach((inputElement) => {
    inputElement.addEventListener('input', (event) => {
      syncSearchInputs(event.target);
      applyFilters();
    });
  });

  elements.heroSearchButton.addEventListener('click', applyFilters);
}

async function init() {
  try {
    state.allItems = await fetchItems();
    bindEvents();
    applyFilters();
  } catch (error) {
    elements.grid.innerHTML = `
      <article class="empty-state">
        <h3>Data loading failed</h3>
        <p>${error.message}</p>
      </article>
    `;
  }
}

init();
