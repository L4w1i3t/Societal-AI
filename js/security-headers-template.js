/**
 * Security Header Template for Societal AI Pages
 * Include this in the <head> section of all HTML pages
 */

/* Security Meta Tags - Add these to every page */
const securityHeaders = `
    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()">
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';">
`;

/*
 * Add this script tag to load security utilities in every page:
 * <script src="../js/security.js"></script>
 *
 * Make sure to load it before other JavaScript files that might need it.
 */
