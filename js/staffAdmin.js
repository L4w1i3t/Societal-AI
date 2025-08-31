/**
 * Staff Admin Interface
 * Provides tools for managing staff members dynamically
 * Include this script only when admin functionality is needed
 */

class StaffAdmin {
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
    
    // Add keyboard shortcut to toggle admin mode (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
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
    adminPanel.id = 'staff-admin-panel';
    adminPanel.innerHTML = `
      <div class="admin-header">
        <h3>Staff Admin Panel</h3>
        <button id="close-admin">×</button>
      </div>
      <div class="admin-content">
        <div class="admin-section">
          <h4>Add New Staff Member</h4>
          <form id="add-staff-form">
            <input type="text" id="staff-id" placeholder="ID (unique)" required>
            <input type="text" id="staff-name" placeholder="Full Name" required>
            <input type="text" id="staff-title" placeholder="Title/Position" required>
            <input type="text" id="staff-degree" placeholder="Degree" required>
            <textarea id="staff-bio" placeholder="Bio" rows="3"></textarea>
            <input type="text" id="staff-image" placeholder="Image path (../assets/team/name.webp)" required>
            <button type="submit">Add Staff Member</button>
          </form>
        </div>
        
        <div class="admin-section">
          <h4>Current Staff Members</h4>
          <div id="staff-list"></div>
        </div>
        
        <div class="admin-section">
          <h4>Export/Import</h4>
          <button id="export-data">Export JSON</button>
          <input type="file" id="import-file" accept=".json" style="display: none;">
          <button id="import-data">Import JSON</button>
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
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      display: none;
      font-family: Inter, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    // Add admin panel styles
    const style = document.createElement('style');
    style.textContent = `
      #staff-admin-panel .admin-header {
        background: #333;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #staff-admin-panel .admin-content {
        padding: 20px;
      }
      
      #staff-admin-panel .admin-section {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }
      
      #staff-admin-panel input, #staff-admin-panel textarea {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      
      #staff-admin-panel button {
        background: #007cba;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px 5px 5px 0;
      }
      
      #staff-admin-panel button:hover {
        background: #005a87;
      }
      
      #staff-admin-panel #close-admin {
        background: transparent;
        font-size: 20px;
        padding: 0;
        width: 30px;
        height: 30px;
      }
      
      #staff-admin-panel .staff-item {
        background: #f9f9f9;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #staff-admin-panel .staff-item button {
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
    document.getElementById('close-admin').addEventListener('click', () => {
      this.hideAdminPanel();
    });

    // Add staff form submission
    document.getElementById('add-staff-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addStaffMember();
    });

    // Export data
    document.getElementById('export-data').addEventListener('click', () => {
      this.exportStaffData();
    });

    // Import data
    document.getElementById('import-data').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
      this.importStaffData(e.target.files[0]);
    });
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
    const panel = document.getElementById('staff-admin-panel');
    panel.style.display = 'block';
    this.updateStaffList();
  }

  /**
   * Hide admin panel
   */
  hideAdminPanel() {
    const panel = document.getElementById('staff-admin-panel');
    panel.style.display = 'none';
    this.isAdminMode = false;
  }

  /**
   * Add new staff member from form
   */
  addStaffMember() {
    const formData = {
      id: document.getElementById('staff-id').value.trim(),
      name: document.getElementById('staff-name').value.trim(),
      title: document.getElementById('staff-title').value.trim(),
      degree: document.getElementById('staff-degree').value.trim(),
      bio: document.getElementById('staff-bio').value.trim() || 'Bio coming soon.',
      image: document.getElementById('staff-image').value.trim()
    };

    // Validate required fields
    if (!formData.id || !formData.name || !formData.title || !formData.degree || !formData.image) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if ID already exists
    if (window.staffLoader && window.staffLoader.getStaffMember(formData.id)) {
      alert('A staff member with this ID already exists.');
      return;
    }

    // Add the staff member
    if (window.staffLoader) {
      window.staffLoader.addStaffMember(formData);
      this.updateStaffList();
      document.getElementById('add-staff-form').reset();
      alert('Staff member added successfully!');
    }
  }

  /**
   * Remove staff member
   */
  removeStaffMember(id) {
    if (confirm(`Are you sure you want to remove this staff member?`)) {
      if (window.staffLoader) {
        window.staffLoader.removeStaffMember(id);
        this.updateStaffList();
      }
    }
  }

  /**
   * Update the staff list in admin panel
   */
  updateStaffList() {
    const staffList = document.getElementById('staff-list');
    if (!window.staffLoader || !window.staffLoader.staffData) {
      staffList.innerHTML = '<p>No staff data available.</p>';
      return;
    }

    staffList.innerHTML = window.staffLoader.staffData.staff.map(member => `
      <div class="staff-item">
        <span><strong>${member.name}</strong> (${member.title})</span>
        <button onclick="staffAdmin.removeStaffMember('${member.id}')">Remove</button>
      </div>
    `).join('');
  }

  /**
   * Export staff data as JSON
   */
  exportStaffData() {
    if (!window.staffLoader || !window.staffLoader.staffData) {
      alert('No staff data to export.');
      return;
    }

    const dataStr = JSON.stringify(window.staffLoader.staffData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'staff-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import staff data from JSON file
   */
  async importStaffData(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.staff || !Array.isArray(data.staff)) {
        alert('Invalid JSON format. Expected format: {"staff": [...]}');
        return;
      }

      if (window.staffLoader) {
        window.staffLoader.staffData = data;
        window.staffLoader.renderStaffGrid();
        this.updateStaffList();
        alert('Staff data imported successfully!');
      }
    } catch (error) {
      alert('Error importing file: ' + error.message);
    }
  }
}

// Initialize admin interface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.staffAdmin = new StaffAdmin();
  
  // Show instructions for admin mode
  console.log('Staff Admin loaded. Press Ctrl+Shift+A to open admin panel.');
});
