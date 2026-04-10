import { LostFoundItem } from './item.js';

export async function fetchItems() {
  const response = await fetch('./data/items.json');

  if (!response.ok) {
    throw new Error('Could not load item data.');
  }

  const rawItems = await response.json();
  return rawItems.map((item) => new LostFoundItem(item));
}
