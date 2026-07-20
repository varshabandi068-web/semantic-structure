/**
 * Projects Filtering & Search Logic
 * Includes dynamic filtering, keyboard state tracking (aria-pressed), and aria-live announcements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectsFilter();
});

function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card-container');
  const announcer = document.getElementById('filter-announcer');

  if (!projectCards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Filter Buttons Event Listener
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update UI button states
      filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');

      activeCategory = button.getAttribute('data-category');
      applyFilters();
    });
  });

  // Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  /**
   * Applies the combined active filters and search queries to the grid
   */
  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(container => {
      const card = container.querySelector('.project-card');
      const categories = card.getAttribute('data-categories').split(' ');
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.project-tag')).map(tag => tag.textContent.toLowerCase());

      const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
      
      const matchesSearch = title.includes(searchQuery) || 
                            description.includes(searchQuery) || 
                            tags.some(tag => tag.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        container.style.display = 'block';
        visibleCount++;
      } else {
        container.style.display = 'none';
      }
    });

    // Announce filter results to screen readers
    announceResults(visibleCount);
  }

  /**
   * Updates an aria-live region to inform assistive tech users of visual shifts
   */
  let announceTimeout;
  function announceResults(count) {
    if (!announcer) return;
    
    // Clear previous timeout to throttle announcements while typing
    clearTimeout(announceTimeout);

    announceTimeout = setTimeout(() => {
      const categoryName = activeCategory === 'all' ? 'all' : document.querySelector(`.filter-btn[data-category="${activeCategory}"]`).textContent;
      let msg = `Showing ${count} projects`;
      if (activeCategory !== 'all') {
        msg += ` in the ${categoryName} category`;
      }
      if (searchQuery) {
        msg += ` matching search "${searchQuery}"`;
      }
      msg += '.';
      announcer.textContent = msg;
    }, 400); // 400ms debounce
  }
}
