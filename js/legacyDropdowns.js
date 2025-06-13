// Legacy page dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const isActive = this.classList.contains('active');
            
            // Close all other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    otherToggle.classList.remove('active');
                    const otherTargetId = otherToggle.getAttribute('data-target');
                    const otherContent = document.getElementById(otherTargetId);
                    if (otherContent) {
                        otherContent.classList.remove('active');
                    }
                }
            });
            
            // Toggle current dropdown
            if (isActive) {
                this.classList.remove('active');
                targetContent.classList.remove('active');
            } else {
                this.classList.add('active');
                targetContent.classList.add('active');
            }
        });
    });
    
    // Add smooth scrolling animation when dropdown opens
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    dropdownContents.forEach(content => {
        content.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Scroll the opened dropdown into view if needed
                const rect = this.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.bottom > windowHeight) {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end' 
                    });
                }
            }
        });
    });
    
    // Add keyboard accessibility
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.legacy-dropdown')) {
            dropdownToggles.forEach(toggle => {
                toggle.classList.remove('active');
                const targetId = toggle.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('active');
                }
            });
        }
    });
});
