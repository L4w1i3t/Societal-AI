/**
 * Legacy Loader Module
 * Dynamically loads and renders legacy content from legacy.json
 */

class LegacyLoader {
  constructor() {
    this.legacyData = null;
  }

  /**
   * Load legacy data from JSON file
   */
  async loadLegacyData() {
    try {
      const response = await fetch('../data/legacy.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.legacyData = await response.json();
      return this.legacyData;
    } catch (error) {
      console.error('Error loading legacy data:', error);
      return null;
    }
  }

  /**
   * Create a board member card HTML element
   * @param {Object} member - Board member data
   * @returns {string} HTML string for board member card
   */
  createBoardMemberCard(member) {
    return `
      <div class="board-card" data-member-id="${member.id}">
        <div class="board-photo">
          <img src="${member.image}" alt="${member.name}" />
        </div>
        <div class="board-info">
          <h3>${member.name}</h3>
          <h4>${member.title}</h4>
          <p class="major">Degree: ${member.degree}</p>
          ${member.bio ? `<p class="bio hidden">${member.bio}</p>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Create an event item HTML element
   * @param {Object} event - Event data
   * @returns {string} HTML string for event item
   */
  createEventItem(event) {
    return `
      <div class="event-item" data-event-id="${event.id}">
        <div class="event-date">
          <span class="month">${event.date.month}</span>
          <span class="day">${event.date.day}</span>
          <span class="year">${event.date.year}</span>
        </div>
        <div class="event-details">
          <h3>${event.title}</h3>
          <p class="event-location">${event.location}</p>
          <p class="event-description">${event.description}</p>
        </div>
      </div>
    `;
  }

  /**
   * Create a legacy dropdown section for board members
   * @param {string} classId - Class identifier
   * @param {Object} classData - Class data
   * @returns {string} HTML string for dropdown section
   */
  createBoardDropdown(classId, classData) {
    const membersHtml = classData.members.map(member => 
      this.createBoardMemberCard(member)
    ).join('');

    return `
      <div class="legacy-dropdown">
        <button class="dropdown-toggle" data-target="${classId}">
          <span>${classData.title}</span>
          <svg
            class="dropdown-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div class="dropdown-content" id="${classId}">
          <div class="board-grid">
            ${membersHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create a legacy dropdown section for events
   * @param {string} yearId - Year identifier
   * @param {Object} yearData - Year data
   * @returns {string} HTML string for dropdown section
   */
  createEventsDropdown(yearId, yearData) {
    const eventsHtml = yearData.events.map(event => 
      this.createEventItem(event)
    ).join('');

    return `
      <div class="legacy-dropdown">
        <button class="dropdown-toggle" data-target="events-${yearId}">
          <span>${yearData.title}</span>
          <svg
            class="dropdown-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div class="dropdown-content" id="events-${yearId}">
          <div class="events-list">
            ${eventsHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render past board members section
   */
  renderPastBoardMembers() {
    if (!this.legacyData || !this.legacyData.pastBoardMembers) {
      console.error('No past board members data available');
      return;
    }

    // Find the board members section by looking for the loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator-board');
    const boardSection = loadingIndicator ? loadingIndicator.closest('.container') : null;
    
    if (!boardSection) {
      console.error('Board members section not found');
      return;
    }

    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    // Find the container after the section description
    const existingDropdowns = boardSection.querySelectorAll('.legacy-dropdown');
    existingDropdowns.forEach(dropdown => dropdown.remove());

    // Create dropdowns for each class
    Object.entries(this.legacyData.pastBoardMembers).forEach(([classId, classData]) => {
      const dropdownHtml = this.createBoardDropdown(classId, classData);
      boardSection.insertAdjacentHTML('beforeend', dropdownHtml);
    });
  }

  /**
   * Render past events section
   */
  renderPastEvents() {
    if (!this.legacyData || !this.legacyData.pastEvents) {
      console.error('No past events data available');
      return;
    }

    // Find the events section by looking for the loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator-events');
    const eventsSection = loadingIndicator ? loadingIndicator.closest('.container') : null;
    
    if (!eventsSection) {
      console.error('Past events section not found');
      return;
    }

    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    // Find the container after the section description
    const existingDropdowns = eventsSection.querySelectorAll('.legacy-dropdown');
    existingDropdowns.forEach(dropdown => dropdown.remove());

    // Create dropdowns for each academic year
    Object.entries(this.legacyData.pastEvents).forEach(([yearId, yearData]) => {
      const dropdownHtml = this.createEventsDropdown(yearId, yearData);
      eventsSection.insertAdjacentHTML('beforeend', dropdownHtml);
    });
  }

  /**
   * Set up dropdown functionality
   */
  setupDropdowns() {
    // Re-initialize dropdown functionality after content is loaded
    if (typeof window.initializeLegacyDropdowns === 'function') {
      window.initializeLegacyDropdowns();
    } else {
      // Fallback dropdown functionality
      this.initializeDropdownsFallback();
    }
  }

  /**
   * Fallback dropdown functionality if legacyDropdowns.js is not available
   */
  initializeDropdownsFallback() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      // Remove existing listeners
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      newToggle.addEventListener('click', () => {
        const targetId = newToggle.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const arrow = newToggle.querySelector('.dropdown-arrow');
        
        if (content && arrow) {
          const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';
          
          if (isExpanded) {
            content.style.maxHeight = '0px';
            arrow.style.transform = 'rotate(0deg)';
            newToggle.setAttribute('aria-expanded', 'false');
          } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            arrow.style.transform = 'rotate(180deg)';
            newToggle.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
  }

  /**
   * Initialize the legacy loader
   */
  async init() {
    await this.loadLegacyData();
    this.renderPastBoardMembers();
    this.renderPastEvents();
    this.setupDropdowns();
  }

  /**
   * Add a new board member to a specific class
   * @param {string} classId - Class identifier
   * @param {Object} member - New board member data
   */
  addBoardMember(classId, member) {
    if (!this.legacyData || !this.legacyData.pastBoardMembers) {
      this.legacyData = { pastBoardMembers: {}, pastEvents: {} };
    }
    
    if (!this.legacyData.pastBoardMembers[classId]) {
      this.legacyData.pastBoardMembers[classId] = {
        title: `Class of ${classId}`,
        members: []
      };
    }
    
    this.legacyData.pastBoardMembers[classId].members.push(member);
    this.renderPastBoardMembers();
    this.setupDropdowns();
  }

  /**
   * Add a new event to a specific academic year
   * @param {string} yearId - Year identifier
   * @param {Object} event - New event data
   */
  addEvent(yearId, event) {
    if (!this.legacyData || !this.legacyData.pastEvents) {
      this.legacyData = { pastBoardMembers: {}, pastEvents: {} };
    }
    
    if (!this.legacyData.pastEvents[yearId]) {
      this.legacyData.pastEvents[yearId] = {
        title: `Academic Year ${yearId}`,
        events: []
      };
    }
    
    this.legacyData.pastEvents[yearId].events.push(event);
    this.renderPastEvents();
    this.setupDropdowns();
  }

  /**
   * Get legacy data
   */
  getData() {
    return this.legacyData;
  }
}

// Initialize legacy loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const legacyLoader = new LegacyLoader();
  await legacyLoader.init();
  
  // Make legacy loader globally accessible
  window.legacyLoader = legacyLoader;
});
