/**
 * Dynamically adds the header and footer to every page
 * so we don't have to hardcode them into every HTML file
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the current path to handle relative URLs correctly
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/pages/');
    const basePath = isInSubfolder ? '../' : '';
    
    // Function to load HTML component
    async function loadComponent(url, targetId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            let html = await response.text();
            
            // Fix relative paths based on current page location
            if (isInSubfolder) {
                // If we're in a subfolder like /pages/, adjust paths to go up one level
                html = html.replace(/href="pages\//g, 'href="../pages/');
                html = html.replace(/src="assets\//g, 'src="../assets/');
                html = html.replace(/href="index.html"/g, 'href="../index.html"');
            }
            
            // Insert the component into the page
            document.getElementById(targetId).innerHTML = html;
            
            // Update active links in navigation
            updateActiveNavLinks();
            
            // Update copyright year in footer
            updateCopyrightYear();
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }
    
    // Update the active link in navigation
    function updateActiveNavLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav a, .footer-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && (href === '/' || href === ''))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Update copyright year
    function updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Load header and footer
    loadComponent(`${basePath}components/header.html`, 'header-container');
    loadComponent(`${basePath}components/footer.html`, 'footer-container');
    
    // Handle mobile menu toggle
    document.addEventListener('click', function(event) {
        // Check if the clicked element is a mobile menu toggle button or its child
        if (event.target.closest('.mobile-menu-toggle')) {
            document.body.classList.toggle('mobile-menu-open');
            
            // Create mobile nav if it doesn't exist
            let mobileNav = document.querySelector('.mobile-nav');
            if (!mobileNav) {
                mobileNav = document.createElement('div');
                mobileNav.className = 'mobile-nav';
                
                // Clone the main navigation links
                const mainNavLinks = document.querySelector('.main-nav ul');
                if (mainNavLinks) {
                    const clonedLinks = mainNavLinks.cloneNode(true);
                    mobileNav.appendChild(clonedLinks);
                    document.body.appendChild(mobileNav);
                }
            }
            
            mobileNav.classList.toggle('open');
            event.target.closest('.mobile-menu-toggle').classList.toggle('active');
        }
    });
});