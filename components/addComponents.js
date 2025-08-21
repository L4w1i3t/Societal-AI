/**
 * Dynamically adds the header and footer to every page
 * so we don't have to hardcode them into every HTML file
 * Includes security measures to prevent XSS and injection attacks
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Get the current path to handle relative URLs correctly
  const currentPath = window.location.pathname;
  const isInSubfolder = currentPath.includes("/pages/");
  const basePath = isInSubfolder ? "../" : "";

  // Function to load HTML component with security validation
  async function loadComponent(url, targetId) {
    try {
      // Validate URL for security
      if (
        !url ||
        typeof url !== "string" ||
        !targetId ||
        typeof targetId !== "string"
      ) {
        throw new Error("Invalid parameters for loadComponent");
      }

      // Ensure URL is relative and safe
      if (url.includes("://") || url.startsWith("//")) {
        throw new Error("External URLs not allowed for components");
      }

      // Add version parameter to component URL for cache busting
      const versionedUrl = window.assetVersioning
        ? window.assetVersioning.addVersionParameter(url)
        : url;

      const response = await fetch(versionedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      let html = await response.text();

      // Validate that response is HTML and not script content
      if (!html || typeof html !== "string") {
        throw new Error("Invalid response content");
      }

      // Basic security check - ensure we're getting HTML content
      if (
        response.headers.get("content-type") &&
        !response.headers.get("content-type").includes("text/html") &&
        !response.headers.get("content-type").includes("text/plain")
      ) {
        throw new Error("Invalid content type for component");
      }

      // Fix relative paths based on current page location
      if (isInSubfolder) {
        // If we're in a subfolder like /pages/, adjust paths to go up one level
        html = html.replace(/href="pages\//g, 'href="../pages/');
        html = html.replace(/src="assets\//g, 'src="../assets/');
        html = html.replace(/href="index.html"/g, 'href="../index.html"');
      }

      // Apply versioning to assets in the HTML
      if (window.assetVersioning) {
        html = window.assetVersioning.versionDynamicComponents(html, basePath);
      }

      // Get target element and validate it exists
      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        throw new Error(`Target element with ID '${targetId}' not found`);
      }

      // Safely insert the component into the page using security utils if available
      if (window.SecurityUtils) {
        window.SecurityUtils.safeSetInnerHTML(targetElement, html);
      } else {
        // Fallback with basic sanitization
        html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
        targetElement.innerHTML = html;
      }

      // Update active links in navigation
      updateActiveNavLinks();

      // Update copyright year in footer
      updateCopyrightYear();
    } catch (error) {
      console.error("Error loading component:", error);
    }
  }

  // Update the active link in navigation
  function updateActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      // Check for exact matches and special cases
      if (
        // Home page matches
        (currentPath.endsWith("index.html") ||
          currentPath === "/" ||
          currentPath.endsWith("/")) &&
        (href === "index.html" || href === "../index.html" || href === "/")
      ) {
        link.classList.add("active");
      }
      // Staff/Team page
      else if (
        currentPath.includes("staff.html") &&
        href.includes("staff.html")
      ) {
        link.classList.add("active");
      }
      // Calendar/Events page
      else if (
        currentPath.includes("calendar.html") &&
        href.includes("calendar.html")
      ) {
        link.classList.add("active");
      }
      // Legacy page
      else if (
        currentPath.includes("legacy.html") &&
        href.includes("legacy.html")
      ) {
        link.classList.add("active");
      }
      // Contact page
      else if (
        currentPath.includes("contact.html") &&
        href.includes("contact.html")
      ) {
        link.classList.add("active");
      }
      // Join page (in header actions, not main nav, but handle it anyway)
      else if (
        currentPath.includes("join.html") &&
        href.includes("join.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Update copyright year
  function updateCopyrightYear() {
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Load header and footer
  loadComponent(`${basePath}components/header.html`, "header-container");
  loadComponent(`${basePath}components/footer.html`, "footer-container");

  // Handle mobile menu toggle
  document.addEventListener("click", function (event) {
    // Check if the clicked element is a mobile menu toggle button or its child
    if (event.target.closest(".mobile-menu-toggle")) {
      document.body.classList.toggle("mobile-menu-open");

      // Create mobile nav if it doesn't exist
      let mobileNav = document.querySelector(".mobile-nav");
      if (!mobileNav) {
        mobileNav = document.createElement("div");
        mobileNav.className = "mobile-nav";

        // Clone the main navigation links
        const mainNavLinks = document.querySelector(".main-nav ul");
        if (mainNavLinks) {
          const clonedLinks = mainNavLinks.cloneNode(true);
          mobileNav.appendChild(clonedLinks);
          document.body.appendChild(mobileNav);
        }
      }

      // Toggle mobile overlay
      const mobileOverlay = document.querySelector(".mobile-menu-overlay");
      if (mobileOverlay) {
        mobileOverlay.classList.toggle("active");

        // Add click handler to close menu when overlay is clicked
        mobileOverlay.addEventListener("click", function () {
          document.body.classList.remove("mobile-menu-open");
          mobileNav.classList.remove("open");
          mobileOverlay.classList.remove("active");
          document
            .querySelector(".mobile-menu-toggle")
            .classList.remove("active");
        });
      }

      mobileNav.classList.toggle("open");
      event.target.closest(".mobile-menu-toggle").classList.toggle("active");
    }
  });

  // Add animated glow effects to the page
  addDecorativeElements();
});

// Function to add decorative elements like animated glow effects
function addDecorativeElements() {
  // Add scroll animations for elements
  const scrollElements = document.querySelectorAll(
    ".staff-card, .event-card, .btn",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  scrollElements.forEach((element) => {
    observer.observe(element);
  });
}
