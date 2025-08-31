document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Create modal element with proper security attributes
  const modalContainer = document.createElement("div");
  modalContainer.className = "staff-modal-container";
  modalContainer.setAttribute("role", "dialog");
  modalContainer.setAttribute("aria-modal", "true");
  modalContainer.setAttribute("aria-hidden", "true");
  modalContainer.setAttribute("aria-labelledby", "staff-modal-title");

  // Create modal HTML structure safely
  const modalHTML = `
        <div class="staff-modal">
            <button class="modal-close-btn" aria-label="Close staff information">&times;</button>
            <div class="modal-content">
                <div class="modal-header">
                    <img src="" alt="" class="modal-photo">
                    <div class="modal-header-info">
                        <h2 id="staff-modal-title" class="modal-name"></h2>
                        <h3 class="modal-position"></h3>
                        <p class="modal-degree"></p>
                    </div>
                </div>
                <div class="modal-bio"></div>
            </div>
        </div>
    `;

  // Use security utils if available, otherwise use safe fallback
  if (window.SecurityUtils) {
    window.SecurityUtils.safeSetInnerHTML(modalContainer, modalHTML);
  } else {
    modalContainer.innerHTML = modalHTML;
  }

  document.body.appendChild(modalContainer);

  // Get modal elements
  const modal = document.querySelector(".staff-modal-container");
  const closeBtn = modal.querySelector(".modal-close-btn");

  // Function to close modal
  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  // Set up close button event listener
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Note: Staff card event listeners are now handled by staffLoader.js
  // This ensures they work with dynamically loaded content
});
