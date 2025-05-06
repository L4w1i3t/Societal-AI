/**
 * Asset versioning system for cache-busting
 * This ensures that when you update assets, browsers will download the new version
 * instead of using cached versions
 */

// Generate a unique version identifier based on current timestamp
// You can manually update this version when you deploy new changes
const VERSION = new Date().getTime();

// Apply version to all assets that need cache-busting
function applyVersionToAssets() {
    // Apply to stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (!link.href.includes('fonts.googleapis.com')) {
            link.href = addVersionParameter(link.href);
        }
    });

    // Apply to scripts
    document.querySelectorAll('script[src]').forEach(script => {
        script.src = addVersionParameter(script.src);
    });

    // Apply to images loaded via JavaScript
    document.addEventListener('DOMContentLoaded', () => {
        // We'll handle dynamically added images in a moment
        observeDynamicImages();
    });
}

// Add version parameter to URLs
function addVersionParameter(url) {
    // Don't add version to external URLs
    if (url.includes('//') && !url.includes(window.location.hostname)) {
        return url;
    }
    
    // If URL already has a version parameter, update it
    if (url.includes('v=')) {
        return url.replace(/v=\d+/, `v=${VERSION}`);
    }
    
    // Add version parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${VERSION}`;
}

// Monitor for dynamically added images and add version to them
function observeDynamicImages() {
    // Create a MutationObserver to watch for dynamically added images
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // If an image is added
                    if (node.tagName === 'IMG') {
                        // Only version local images
                        if (node.src && !node.src.includes('//')) {
                            node.src = addVersionParameter(node.src);
                        }
                    }
                    // If other elements containing images are added
                    else if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(img => {
                            if (img.src && !img.src.includes('//')) {
                                img.src = addVersionParameter(img.src);
                            }
                        });
                    }
                });
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}

// Apply versioning to dynamically loaded components
function versionDynamicComponents(html, basePath) {
    // Version CSS references
    html = html.replace(/href="((?!http|\/\/).*?\.css)"/g, (match, cssPath) => {
        return `href="${addVersionParameter(cssPath)}"`;
    });
    
    // Version JS references
    html = html.replace(/src="((?!http|\/\/).*?\.js)"/g, (match, jsPath) => {
        return `src="${addVersionParameter(jsPath)}"`;
    });
    
    // Version image references
    html = html.replace(/src="((?!http|\/\/).*?\.(webp|jpg|jpeg|png|gif|svg))"/g, (match, imgPath) => {
        return `src="${addVersionParameter(imgPath)}"`;
    });
    
    return html;
}

// Expose the functions we need in other files
window.assetVersioning = {
    VERSION,
    addVersionParameter,
    versionDynamicComponents
};

// Apply versioning immediately
applyVersionToAssets();