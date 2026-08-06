/**
 * Staff Loader Module
 * Dynamically loads and renders staff data from staff.json
 */

const LINKEDIN_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

const EMAIL_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

const CALENDAR_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23ECEAE5' width='200' height='200'/%3E%3Ccircle cx='100' cy='75' r='35' fill='%23D5D2CC'/%3E%3Cellipse cx='100' cy='155' rx='55' ry='40' fill='%23D5D2CC'/%3E%3C/svg%3E`;

class StaffLoader {
  constructor() {
    this.staffData = null;
  }

  async loadStaffData() {
    try {
      const response = await fetch('../data/staff.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      this.staffData = await response.json();
      return this.staffData;
    } catch (error) {
      console.error('Error loading staff data:', error);
      return null;
    }
  }

  buildSocialLinks(links) {
    if (!links) return '';
    const parts = [];
    if (links.linkedin) {
      parts.push(`<a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="staff-link staff-link--linkedin" title="LinkedIn" onclick="event.stopPropagation()">${LINKEDIN_SVG}</a>`);
    }
    if (links.email) {
      parts.push(`<a href="mailto:${links.email}" class="staff-link staff-link--email" title="Email ${links.email}" onclick="event.stopPropagation()">${EMAIL_SVG}</a>`);
    }
    if (links.calendly) {
      parts.push(`<a href="${links.calendly}" target="_blank" rel="noopener noreferrer" class="staff-link staff-link--calendly" title="Schedule a meeting" onclick="event.stopPropagation()">${CALENDAR_SVG}</a>`);
    }
    if (parts.length === 0) return '';
    return `<div class="staff-links">${parts.join('')}</div>`;
  }

  createStaffCard(member) {
    if (member.placeholder) {
      return `
        <div class="staff-card staff-card--placeholder" aria-label="${member.title} — position open">
          <div class="staff-photo staff-photo--empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="staff-info">
            <h3>Applications Open</h3>
            <h4>${member.title}</h4>
          </div>
        </div>
      `;
    }

    const imgSrc = member.image || PLACEHOLDER_SVG;
    const socialLinks = this.buildSocialLinks(member.links);

    return `
      <div class="staff-card" data-staff-id="${member.id}">
        <div class="staff-photo">
          <img src="${imgSrc}" alt="${member.name}" />
        </div>
        <div class="staff-info">
          <h3>${member.name}</h3>
          <h4>${member.title}</h4>
          <p class="major hidden-degree">${member.degree || ''}</p>
          <p class="bio hidden">${member.bio || ''}</p>
          ${socialLinks}
        </div>
      </div>
    `;
  }

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

    if (loadingIndicator) loadingIndicator.style.display = 'none';
    staffGrid.innerHTML = '';

    this.staffData.staff.forEach(member => {
      staffGrid.innerHTML += this.createStaffCard(member);
    });

    staffGrid.style.display = 'grid';
    this.setupModalEvents();
  }

  async init() {
    await this.loadStaffData();
    this.renderStaffGrid();
  }

  getStaffMember(id) {
    if (!this.staffData || !this.staffData.staff) return null;
    return this.staffData.staff.find(member => member.id === id);
  }

  setupModalEvents() {
    const waitForModal = () => {
      const modal = document.querySelector('.staff-modal-container');
      if (!modal) {
        setTimeout(waitForModal, 100);
        return;
      }
      this.attachModalListeners(modal);
    };
    waitForModal();
  }

  attachModalListeners(modal) {
    const staffCards = document.querySelectorAll('.staff-card:not(.staff-card--placeholder)');

    const modalPhoto = modal.querySelector('.modal-photo');
    const modalName = modal.querySelector('.modal-name');
    const modalPosition = modal.querySelector('.modal-position');
    const modalDegree = modal.querySelector('.modal-degree');
    const modalBio = modal.querySelector('.modal-bio');

    staffCards.forEach((card) => {
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);

      newCard.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const nameEl = newCard.querySelector('h3');
        const positionEl = newCard.querySelector('h4');
        const degreeEl = newCard.querySelector('.hidden-degree');
        const imgEl = newCard.querySelector('img');
        const bioEl = newCard.querySelector('.bio');

        const name = nameEl ? nameEl.textContent.trim() : 'Unknown';
        const position = positionEl ? positionEl.textContent.trim() : '';
        const degree = degreeEl ? degreeEl.textContent.trim() : '';
        const photo = imgEl ? imgEl.src : '';
        const bio = bioEl ? bioEl.textContent.trim() : 'Biography coming soon.';

        const sanitizedPhoto = window.SecurityUtils
          ? window.SecurityUtils.sanitizeUrl(photo)
          : photo;

        if (window.SecurityUtils) {
          modalPhoto.src = sanitizedPhoto;
          modalPhoto.alt = window.SecurityUtils.escapeHtml(name);
          window.SecurityUtils.safeSetTextContent(modalName, name);
          window.SecurityUtils.safeSetTextContent(modalPosition, position);
          window.SecurityUtils.safeSetTextContent(modalDegree, degree ? `Degree: ${degree}` : '');
          window.SecurityUtils.safeSetTextContent(modalBio, bio || 'Biography coming soon.');
        } else {
          modalPhoto.src = sanitizedPhoto;
          modalPhoto.alt = name;
          modalName.textContent = name;
          modalPosition.textContent = position;
          modalDegree.textContent = degree ? `Degree: ${degree}` : '';
          modalBio.textContent = bio || 'Biography coming soon.';
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const staffLoader = new StaffLoader();
  await staffLoader.init();
  window.staffLoader = staffLoader;
});
