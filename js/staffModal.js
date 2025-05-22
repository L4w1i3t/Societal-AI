document.addEventListener('DOMContentLoaded', () => {    // Create modal element
    const modalContainer = document.createElement('div');
    modalContainer.className = 'staff-modal-container';
    modalContainer.setAttribute('role', 'dialog');
    modalContainer.setAttribute('aria-modal', 'true');
    modalContainer.setAttribute('aria-hidden', 'true');
    modalContainer.setAttribute('aria-labelledby', 'staff-modal-title');
    modalContainer.innerHTML = `
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
    document.body.appendChild(modalContainer);

    // Get modal elements
    const modal = document.querySelector('.staff-modal-container');
    const modalPhoto = modal.querySelector('.modal-photo');
    const modalName = modal.querySelector('.modal-name');
    const modalPosition = modal.querySelector('.modal-position');
    const modalDegree = modal.querySelector('.modal-degree');
    const modalBio = modal.querySelector('.modal-bio');
    const closeBtn = modal.querySelector('.modal-close-btn');    // We'll get bio data directly from the HTML
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    
    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });// Add event listeners to staff cards
    const staffCards = document.querySelectorAll('.staff-card');
    staffCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h3').textContent;
            const position = card.querySelector('h4').textContent;
            const degree = card.querySelector('.major').textContent;
            const photo = card.querySelector('img').src;
            const bioElement = card.querySelector('.bio');
            const bio = bioElement ? bioElement.textContent : 'Biography coming soon.';

            // Populate modal with staff info
            modalPhoto.src = photo;
            modalPhoto.alt = name;
            modalName.textContent = name;
            modalPosition.textContent = position;
            modalDegree.textContent = degree;
            modalBio.textContent = bio;            // Show modal
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            
            // Focus the close button for accessibility
            setTimeout(() => {
                closeBtn.focus();
            }, 100);
        });
    });
});
