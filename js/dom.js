export function createItemCard(item) {
  return `
    <article class="card">
      <figure>
        <img src="${item.image}" alt="${item.title}" />
      </figure>
      <div class="content">
        <header class="row">
          <h3>${item.title}</h3>
          <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
        </header>

        <p>${item.description}</p>

        <div class="meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" stroke="currentColor" stroke-width="2" />
              <circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="2" />
            </svg>
            ${item.location}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
              <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" />
            </svg>
            ${item.getRelativeTime()}
          </span>
          <span class="meta-item category-pill">${item.category}</span>
        </div>

        <footer class="actions">
          <a href="details.html?id=${item.id}">Details</a>
          <a href="ContactInfo.html?id=${item.id}" class="primary">${item.getActionLabel()}</a>
        </footer>
      </div>
    </article>
  `;
}

export function renderCards(container, items) {
  if (!items.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = items.map(createItemCard).join('');
}

export function renderSummary(container, summary) {
  container.innerHTML = `
    <article class="summary-card">
      <strong>${summary.total}</strong>
      <span>Total Items</span>
    </article>
    <article class="summary-card">
      <strong>${summary.lost}</strong>
      <span>Lost Posts</span>
    </article>
    <article class="summary-card">
      <strong>${summary.found}</strong>
      <span>Found Posts</span>
    </article>
    <article class="summary-card">
      <strong>${summary.locations}</strong>
      <span>Active Locations</span>
    </article>
  `;
}

export function renderHighlight(container, latestItems) {
  const titles = latestItems.map((item) => item.title).join(', ');
  container.textContent = titles
    ? `Latest updates: ${titles}.`
    : 'Latest updates will appear here.';
}

export function renderStatusText(element, count) {
  element.textContent = `${count} item${count === 1 ? '' : 's'} shown`;
}
