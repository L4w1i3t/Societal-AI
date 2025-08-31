/**
 * Staff Loader Module
 * Dynamically loads and renders staff data from staff.json
 */

class StaffLoader {
  constructor() {
    this.staffData = null;
  }

  /**
   * Load staff data from JSON file
   */
  async loadStaffData() {
    try {
      const response = await fetch('../data/staff.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.staffData = await response.json();
      return this.staffData;
    } catch (error) {
      console.error('Error loading staff data:', error);
      return null;
    }
  }

  /**
   * Create a staff card HTML element
   * @param {Object} member - Staff member data
   * @returns {string} HTML string for staff card
   */
  createStaffCard(member) {
    return `
      <div class="staff-card" data-staff-id="${member.id}">
        <div class="staff-photo">
          <img src="${member.image}" alt="${member.name}" />
        </div>
        <div class="staff-info">
          <h3>${member.name}</h3>
          <h4>${member.title}</h4>
          <p class="major">Degree: ${member.degree}</p>
          <p class="bio hidden">${member.bio}</p>
        </div>
      </div>
    `;
  }

  /**
   * Render all staff cards to the staff grid
   */
  renderStaffGrid() {
    if (!this.staffData || !this.staffData.staff) {
      console.error('No staff data available');
      return;
    }

    const staffGrid = document.querySelector('.staff-grid');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (!staffGrid) {
      console.error('Staff grid container not found');
      return;
    }

    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    // Clear existing content
    staffGrid.innerHTML = '';

    // Create and append staff cards
    this.staffData.staff.forEach(member => {
      staffGrid.innerHTML += this.createStaffCard(member);
    });

    // Show the staff grid
    staffGrid.style.display = 'grid';
    
    // Set up modal functionality for the newly created cards
    this.setupModalEvents();
  }

  /**
   * Initialize the staff loader
   */
  async init() {
    await this.loadStaffData();
    this.renderStaffGrid();
  }

  /**
   * Get staff member by ID
   * @param {string} id - Staff member ID
   * @returns {Object|null} Staff member data
   */
  getStaffMember(id) {
    if (!this.staffData || !this.staffData.staff) {
      return null;
    }
    return this.staffData.staff.find(member => member.id === id);
  }

  /**
   * Add a new staff member
   * @param {Object} member - New staff member data
   */
  addStaffMember(member) {
    if (!this.staffData) {
      this.staffData = { staff: [] };
    }
    this.staffData.staff.push(member);
    this.renderStaffGrid();
  }

  /**
   * Update an existing staff member
   * @param {string} id - Staff member ID
   * @param {Object} updatedData - Updated staff member data
   */
  updateStaffMember(id, updatedData) {
    if (!this.staffData || !this.staffData.staff) {
      return false;
    }

    const index = this.staffData.staff.findIndex(member => member.id === id);
    if (index !== -1) {
      this.staffData.staff[index] = { ...this.staffData.staff[index], ...updatedData };
      this.renderStaffGrid();
      return true;
    }
    return false;
  }

  /**
   * Remove a staff member
   * @param {string} id - Staff member ID
   */
  removeStaffMember(id) {
    if (!this.staffData || !this.staffData.staff) {
      return false;
    }

    const index = this.staffData.staff.findIndex(member => member.id === id);
    if (index !== -1) {
      this.staffData.staff.splice(index, 1);
      this.renderStaffGrid();
      return true;
    }
    return false;
  }

  /**
   * Set up modal events for staff cards
   */
  setupModalEvents() {
    // Wait for modal to be ready if it's not available yet
    const waitForModal = () => {
      const modal = document.querySelector('.staff-modal-container');
      if (!modal) {
        // Try again after a short delay
        setTimeout(waitForModal, 100);
        return;
      }
      this.attachModalListeners(modal);
    };
    
    waitForModal();
  }

  /**
   * Attach modal event listeners to staff cards
   * @param {Element} modal - The modal container element
   */
  attachModalListeners(modal) {
    const staffCards = document.querySelectorAll('.staff-card');
    
    const modalPhoto = modal.querySelector('.modal-photo');
    const modalName = modal.querySelector('.modal-name');
    const modalPosition = modal.querySelector('.modal-position');
    const modalDegree = modal.querySelector('.modal-degree');
    const modalBio = modal.querySelector('.modal-bio');

    staffCards.forEach((card) => {
      // Remove existing listeners by cloning the element
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      newCard.addEventListener('click', () => {
        // Safely extract data from the card elements
        const nameElement = newCard.querySelector('h3');
        const positionElement = newCard.querySelector('h4');
        const degreeElement = newCard.querySelector('.major');
        const imgElement = newCard.querySelector('img');
        const bioElement = newCard.querySelector('.bio');

        // Validate elements exist and sanitize content
        const name = nameElement ? nameElement.textContent.trim() : 'Unknown';
        const position = positionElement
          ? positionElement.textContent.trim()
          : 'Position not specified';
        const degree = degreeElement
          ? degreeElement.textContent.trim()
          : 'Degree not specified';
        const photo = imgElement ? imgElement.src : '';
        const bio = bioElement
          ? bioElement.textContent.trim()
          : 'Biography coming soon.';

        // Validate and sanitize the photo URL
        const sanitizedPhoto = window.SecurityUtils
          ? window.SecurityUtils.sanitizeUrl(photo)
          : photo;

        // Safely populate modal with staff info using security utils
        if (window.SecurityUtils) {
          modalPhoto.src = sanitizedPhoto;
          modalPhoto.alt = window.SecurityUtils.escapeHtml(name);
          window.SecurityUtils.safeSetTextContent(modalName, name);
          window.SecurityUtils.safeSetTextContent(modalPosition, position);
          window.SecurityUtils.safeSetTextContent(modalDegree, degree);
          window.SecurityUtils.safeSetTextContent(modalBio, bio);
        } else {
          // Fallback without security utils
          modalPhoto.src = sanitizedPhoto;
          modalPhoto.alt = name;
          modalName.textContent = name;
          modalPosition.textContent = position;
          modalDegree.textContent = degree;
          modalBio.textContent = bio;
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Focus the close button for accessibility
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
          setTimeout(() => {
            closeBtn.focus();
          }, 100);
        }
      });
    });
  }
}

// Initialize staff loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const staffLoader = new StaffLoader();
  await staffLoader.init();
  
  // Make staff loader globally accessible for potential admin functions
  window.staffLoader = staffLoader;
});
