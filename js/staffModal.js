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
  const modalPhoto = modal.querySelector(".modal-photo");
  const modalName = modal.querySelector(".modal-name");
  const modalPosition = modal.querySelector(".modal-position");
  const modalDegree = modal.querySelector(".modal-degree");
  const modalBio = modal.querySelector(".modal-bio");
  const closeBtn = modal.querySelector(".modal-close-btn"); // We'll get bio data directly from the HTML
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // Function to close modal
  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }; // Close modal when clicking outside
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
  }); // Add event listeners to staff cards
  const staffCards = document.querySelectorAll(".staff-card");
  staffCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Safely extract data from the card elements
      const nameElement = card.querySelector("h3");
      const positionElement = card.querySelector("h4");
      const degreeElement = card.querySelector(".major");
      const imgElement = card.querySelector("img");
      const bioElement = card.querySelector(".bio");

      // Validate elements exist and sanitize content
      const name = nameElement ? nameElement.textContent.trim() : "Unknown";
      const position = positionElement
        ? positionElement.textContent.trim()
        : "Position not specified";
      const degree = degreeElement
        ? degreeElement.textContent.trim()
        : "Degree not specified";
      const photo = imgElement ? imgElement.src : "";
      const bio = bioElement
        ? bioElement.textContent.trim()
        : "Biography coming soon.";

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
      } // Show modal
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      // Focus the close button for accessibility
      setTimeout(() => {
        closeBtn.focus();
      }, 100);
    });
  });
});
