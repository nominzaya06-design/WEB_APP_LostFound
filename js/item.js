export class LostFoundItem {
  constructor({ id, title, status, category, location, description, image, date, contactAction }) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.category = category;
    this.location = location;
    this.description = description;
    this.image = image;
    this.date = date;
    this.contactAction = contactAction;
  }

  matchesKeyword(keyword) {
    if (!keyword) return true;
    const normalized = keyword.trim().toLowerCase();
    const searchable = [this.title, this.category, this.location, this.description, this.status]
      .join(' ')
      .toLowerCase();
    return searchable.includes(normalized);
  }

  matchesLocation(location) {
    return location === 'All Location' || this.location === location;
  }

  matchesCategory(category) {
    return category === 'All Category' || this.category === category;
  }

  matchesStatus(status) {
    return status === 'Lost & found' || this.status === status;
  }

  getActionLabel() {
    return this.status === 'Found' ? 'Claim' : 'Found it?';
  }

  getRelativeTime() {
    const today = new Date('2026-04-09T00:00:00');
    const postedDate = new Date(this.date);
    const diffTime = Math.max(today - postedDate, 0);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;

    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;

    const years = Math.floor(months / 12);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}
