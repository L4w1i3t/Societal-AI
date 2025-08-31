/**
 * Legacy Admin Interface
 * Provides tools for managing legacy content dynamically
 * Include this script only when admin functionality is needed
 */

class LegacyAdmin {
  constructor() {
    this.isAdminMode = false;
    this.initAdminInterface();
  }

  /**
   * Initialize admin interface
   */
  initAdminInterface() {
    // Create admin panel
    this.createAdminPanel();
    
    // Add keyboard shortcut to toggle admin mode (Ctrl+Shift+L)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        this.toggleAdminMode();
      }
    });
  }

  /**
   * Create admin panel HTML
   */
  createAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.id = 'legacy-admin-panel';
    adminPanel.innerHTML = `
      <div class="admin-header">
        <h3>Legacy Admin Panel</h3>
        <button id="close-legacy-admin">×</button>
      </div>
      <div class="admin-content">
        <div class="admin-tabs">
          <button class="tab-btn active" data-tab="board">Board Members</button>
          <button class="tab-btn" data-tab="events">Events</button>
          <button class="tab-btn" data-tab="export">Export/Import</button>
        </div>
        
        <div class="tab-content" id="board-tab">
          <h4>Add New Board Member</h4>
          <form id="add-board-form">
            <select id="board-class" required>
              <option value="">Select Class</option>
              <option value="class-2025">Class of 2025</option>
              <option value="class-2024">Class of 2024</option>
              <option value="class-2023">Class of 2023</option>
            </select>
            <input type="text" id="board-id" placeholder="ID (unique)" required>
            <input type="text" id="board-name" placeholder="Full Name" required>
            <input type="text" id="board-title" placeholder="Title/Position" required>
            <input type="text" id="board-degree" placeholder="Degree" required>
            <textarea id="board-bio" placeholder="Bio" rows="3"></textarea>
            <input type="text" id="board-image" placeholder="Image path" required>
            <button type="submit">Add Board Member</button>
          </form>
          <div id="board-list"></div>
        </div>
        
        <div class="tab-content" id="events-tab" style="display: none;">
          <h4>Add New Event</h4>
          <form id="add-event-form">
            <select id="event-year" required>
              <option value="">Select Academic Year</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
            <input type="text" id="event-id" placeholder="Event ID (unique)" required>
            <input type="text" id="event-title" placeholder="Event Title" required>
            <input type="text" id="event-location" placeholder="Location" required>
            <div class="date-inputs">
              <input type="text" id="event-month" placeholder="Month (JAN)" maxlength="3" required>
              <input type="text" id="event-day" placeholder="Day" maxlength="2" required>
              <input type="text" id="event-year-input" placeholder="Year" maxlength="4" required>
            </div>
            <textarea id="event-description" placeholder="Event Description" rows="3" required></textarea>
            <button type="submit">Add Event</button>
          </form>
          <div id="events-list"></div>
        </div>
        
        <div class="tab-content" id="export-tab" style="display: none;">
          <h4>Export/Import Legacy Data</h4>
          <button id="export-legacy-data">Export JSON</button>
          <input type="file" id="import-legacy-file" accept=".json" style="display: none;">
          <button id="import-legacy-data">Import JSON</button>
        </div>
      </div>
    `;

    // Add styles
    adminPanel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 0;
      z-index: 10000;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      display: none;
      font-family: Inter, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    // Add admin panel styles
    const style = document.createElement('style');
    style.textContent = `
      #legacy-admin-panel .admin-header {
        background: #333;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #legacy-admin-panel .admin-content {
        padding: 20px;
      }
      
      #legacy-admin-panel .admin-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
      }
      
      #legacy-admin-panel .tab-btn {
        background: none;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      }
      
      #legacy-admin-panel .tab-btn.active {
        border-bottom-color: #007cba;
        color: #007cba;
      }
      
      #legacy-admin-panel input, #legacy-admin-panel textarea, #legacy-admin-panel select {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      
      #legacy-admin-panel .date-inputs {
        display: flex;
        gap: 10px;
      }
      
      #legacy-admin-panel .date-inputs input {
        flex: 1;
      }
      
      #legacy-admin-panel button {
        background: #007cba;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px 5px 5px 0;
      }
      
      #legacy-admin-panel button:hover {
        background: #005a87;
      }
      
      #legacy-admin-panel #close-legacy-admin {
        background: transparent;
        font-size: 20px;
        padding: 0;
        width: 30px;
        height: 30px;
      }
      
      #legacy-admin-panel .item {
        background: #f9f9f9;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #legacy-admin-panel .item button {
        background: #dc3545;
        padding: 5px 10px;
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(adminPanel);
    this.bindAdminEvents();
  }

  /**
   * Bind events to admin panel elements
   */
  bindAdminEvents() {
    // Close admin panel
    document.getElementById('close-legacy-admin').addEventListener('click', () => {
      this.hideAdminPanel();
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    // Add board member form
    document.getElementById('add-board-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addBoardMember();
    });

    // Add event form
    document.getElementById('add-event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addEvent();
    });

    // Export/Import
    document.getElementById('export-legacy-data').addEventListener('click', () => {
      this.exportLegacyData();
    });

    document.getElementById('import-legacy-data').addEventListener('click', () => {
      document.getElementById('import-legacy-file').click();
    });

    document.getElementById('import-legacy-file').addEventListener('change', (e) => {
      this.importLegacyData(e.target.files[0]);
    });
  }

  /**
   * Switch between admin tabs
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  }

  /**
   * Toggle admin mode
   */
  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    if (this.isAdminMode) {
      this.showAdminPanel();
    } else {
      this.hideAdminPanel();
    }
  }

  /**
   * Show admin panel
   */
  showAdminPanel() {
    const panel = document.getElementById('legacy-admin-panel');
    panel.style.display = 'block';
    this.updateBoardList();
    this.updateEventsList();
  }

  /**
   * Hide admin panel
   */
  hideAdminPanel() {
    const panel = document.getElementById('legacy-admin-panel');
    panel.style.display = 'none';
    this.isAdminMode = false;
  }

  /**
   * Add new board member
   */
  addBoardMember() {
    const formData = {
      id: document.getElementById('board-id').value.trim(),
      name: document.getElementById('board-name').value.trim(),
      title: document.getElementById('board-title').value.trim(),
      degree: document.getElementById('board-degree').value.trim(),
      bio: document.getElementById('board-bio').value.trim() || 'Bio coming soon.',
      image: document.getElementById('board-image').value.trim()
    };
    const classId = document.getElementById('board-class').value;

    if (!classId || !formData.id || !formData.name || !formData.title || !formData.degree || !formData.image) {
      alert('Please fill in all required fields.');
      return;
    }

    if (window.legacyLoader) {
      window.legacyLoader.addBoardMember(classId, formData);
      this.updateBoardList();
      document.getElementById('add-board-form').reset();
      alert('Board member added successfully!');
    }
  }

  /**
   * Add new event
   */
  addEvent() {
    const eventData = {
      id: document.getElementById('event-id').value.trim(),
      title: document.getElementById('event-title').value.trim(),
      location: document.getElementById('event-location').value.trim(),
      description: document.getElementById('event-description').value.trim(),
      date: {
        month: document.getElementById('event-month').value.trim().toUpperCase(),
        day: document.getElementById('event-day').value.trim(),
        year: document.getElementById('event-year-input').value.trim()
      }
    };
    const yearId = document.getElementById('event-year').value;

    if (!yearId || !eventData.id || !eventData.title || !eventData.location || 
        !eventData.description || !eventData.date.month || !eventData.date.day || !eventData.date.year) {
      alert('Please fill in all required fields.');
      return;
    }

    if (window.legacyLoader) {
      window.legacyLoader.addEvent(yearId, eventData);
      this.updateEventsList();
      document.getElementById('add-event-form').reset();
      alert('Event added successfully!');
    }
  }

  /**
   * Update board members list
   */
  updateBoardList() {
    const boardList = document.getElementById('board-list');
    if (!window.legacyLoader || !window.legacyLoader.legacyData) {
      boardList.innerHTML = '<p>No board data available.</p>';
      return;
    }

    let html = '<h4>Current Board Members</h4>';
    Object.entries(window.legacyLoader.legacyData.pastBoardMembers || {}).forEach(([classId, classData]) => {
      html += `<h5>${classData.title}</h5>`;
      classData.members.forEach(member => {
        html += `
          <div class="item">
            <span><strong>${member.name}</strong> (${member.title})</span>
            <button onclick="legacyAdmin.removeBoardMember('${classId}', '${member.id}')">Remove</button>
          </div>
        `;
      });
    });
    boardList.innerHTML = html;
  }

  /**
   * Update events list
   */
  updateEventsList() {
    const eventsList = document.getElementById('events-list');
    if (!window.legacyLoader || !window.legacyLoader.legacyData) {
      eventsList.innerHTML = '<p>No events data available.</p>';
      return;
    }

    let html = '<h4>Current Events</h4>';
    Object.entries(window.legacyLoader.legacyData.pastEvents || {}).forEach(([yearId, yearData]) => {
      html += `<h5>${yearData.title}</h5>`;
      yearData.events.forEach(event => {
        html += `
          <div class="item">
            <span><strong>${event.title}</strong> (${event.date.month} ${event.date.day}, ${event.date.year})</span>
            <button onclick="legacyAdmin.removeEvent('${yearId}', '${event.id}')">Remove</button>
          </div>
        `;
      });
    });
    eventsList.innerHTML = html;
  }

  /**
   * Export legacy data
   */
  exportLegacyData() {
    if (!window.legacyLoader || !window.legacyLoader.legacyData) {
      alert('No legacy data to export.');
      return;
    }

    const dataStr = JSON.stringify(window.legacyLoader.legacyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'legacy-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import legacy data
   */
  async importLegacyData(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.pastBoardMembers && !data.pastEvents) {
        alert('Invalid JSON format.');
        return;
      }

      if (window.legacyLoader) {
        window.legacyLoader.legacyData = data;
        window.legacyLoader.renderPastBoardMembers();
        window.legacyLoader.renderPastEvents();
        window.legacyLoader.setupDropdowns();
        this.updateBoardList();
        this.updateEventsList();
        alert('Legacy data imported successfully!');
      }
    } catch (error) {
      alert('Error importing file: ' + error.message);
    }
  }
}

// Initialize admin interface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.legacyAdmin = new LegacyAdmin();
  
  console.log('Legacy Admin loaded. Press Ctrl+Shift+L to open admin panel.');
});
