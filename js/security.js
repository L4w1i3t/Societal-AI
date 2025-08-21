/**
 * Security utilities for input sanitization and XSS prevention
 * This file provides functions to safely handle user input and prevent common attacks
 */

window.SecurityUtils = (function () {
  "use strict";

  // HTML entity map for encoding
  const HTML_ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  // Regular expression for detecting potentially malicious scripts
  const SCRIPT_PATTERN = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  const ON_EVENT_PATTERN = /\s*on\w+\s*=/gi;
  const JAVASCRIPT_PATTERN = /javascript\s*:/gi;
  const DATA_URI_PATTERN = /data\s*:\s*text\s*\/\s*html/gi;

  return {
    /**
     * Escape HTML entities to prevent XSS attacks
     * @param {string} text - The text to escape
     * @returns {string} - The escaped text
     */
    escapeHtml: function (text) {
      if (typeof text !== "string") {
        return text;
      }
      return text.replace(/[&<>"'`=\/]/g, function (s) {
        return HTML_ENTITIES[s];
      });
    },

    /**
     * Sanitize HTML content by removing dangerous elements and attributes
     * @param {string} html - The HTML to sanitize
     * @returns {string} - The sanitized HTML
     */
    sanitizeHtml: function (html) {
      if (typeof html !== "string") {
        return html;
      }

      // Remove script tags and their content
      html = html.replace(SCRIPT_PATTERN, "");

      // Remove on* event handlers
      html = html.replace(ON_EVENT_PATTERN, "");

      // Remove javascript: URLs
      html = html.replace(JAVASCRIPT_PATTERN, "");

      // Remove data: URLs that could contain HTML
      html = html.replace(DATA_URI_PATTERN, "");

      return html;
    },

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - The element to set content for
     * @param {string} html - The HTML content to set
     */
    safeSetInnerHTML: function (element, html) {
      if (!element || typeof html !== "string") {
        console.warn("SecurityUtils: Invalid parameters for safeSetInnerHTML");
        return;
      }

      const sanitized = this.sanitizeHtml(html);
      element.innerHTML = sanitized;
    },

    /**
     * Safely set text content (automatically escapes HTML)
     * @param {HTMLElement} element - The element to set content for
     * @param {string} text - The text content to set
     */
    safeSetTextContent: function (element, text) {
      if (!element) {
        console.warn("SecurityUtils: Invalid element for safeSetTextContent");
        return;
      }

      element.textContent = text;
    },

    /**
     * Validate and sanitize URL to prevent XSS via href attributes
     * @param {string} url - The URL to validate
     * @returns {string} - The sanitized URL or '#' if invalid
     */
    sanitizeUrl: function (url) {
      if (typeof url !== "string") {
        return "#";
      }

      // Remove javascript: and data: schemes
      if (JAVASCRIPT_PATTERN.test(url) || DATA_URI_PATTERN.test(url)) {
        return "#";
      }

      // Allow relative URLs, http, https, mailto, and tel
      const allowedSchemes = /^(https?:\/\/|mailto:|tel:|\/|\.\/|\.\.\/|#)/i;
      if (!allowedSchemes.test(url)) {
        return "#";
      }

      return url;
    },

    /**
     * Create a safe DOM element with sanitized content
     * @param {string} tagName - The tag name for the element
     * @param {Object} options - Options for the element (text, html, attributes, etc.)
     * @returns {HTMLElement} - The created element
     */
    createElement: function (tagName, options = {}) {
      const element = document.createElement(tagName);

      // Set text content safely
      if (options.text) {
        this.safeSetTextContent(element, options.text);
      }

      // Set HTML content safely
      if (options.html) {
        this.safeSetInnerHTML(element, options.html);
      }

      // Set attributes safely
      if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
          if (key === "href") {
            element.setAttribute(key, this.sanitizeUrl(value));
          } else if (key.startsWith("on")) {
            // Prevent setting event handlers via attributes
            console.warn(
              "SecurityUtils: Event handlers should be added via addEventListener",
            );
          } else {
            element.setAttribute(key, this.escapeHtml(String(value)));
          }
        }
      }

      // Set CSS classes safely
      if (options.className) {
        element.className = this.escapeHtml(options.className);
      }

      return element;
    },

    /**
     * Validate form input to prevent injection attacks
     * @param {string} input - The input to validate
     * @param {Object} rules - Validation rules
     * @returns {Object} - Validation result with isValid and sanitized value
     */
    validateInput: function (input, rules = {}) {
      if (typeof input !== "string") {
        return {
          isValid: false,
          value: "",
          errors: ["Input must be a string"],
        };
      }

      const errors = [];
      let sanitized = input.trim();

      // Check for maximum length
      if (rules.maxLength && sanitized.length > rules.maxLength) {
        errors.push(`Input too long (max ${rules.maxLength} characters)`);
        sanitized = sanitized.substring(0, rules.maxLength);
      }

      // Check for minimum length
      if (rules.minLength && sanitized.length < rules.minLength) {
        errors.push(`Input too short (min ${rules.minLength} characters)`);
      }

      // Check for required field
      if (rules.required && !sanitized) {
        errors.push("This field is required");
      }

      // Sanitize HTML if not allowing HTML
      if (!rules.allowHtml) {
        sanitized = this.escapeHtml(sanitized);
      } else {
        sanitized = this.sanitizeHtml(sanitized);
      }

      // Email validation
      if (rules.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (sanitized && !emailPattern.test(sanitized)) {
          errors.push("Invalid email format");
        }
      }

      // URL validation
      if (rules.type === "url") {
        sanitized = this.sanitizeUrl(sanitized);
      }

      return {
        isValid: errors.length === 0,
        value: sanitized,
        errors: errors,
      };
    },
  };
})();

// Content Security Policy reporter (if CSP is implemented)
window.addEventListener("securitypolicyviolation", function (e) {
  console.warn("CSP Violation:", e.violatedDirective, e.originalPolicy);

  // You could send this to your server for monitoring
  // fetch('/api/csp-report', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //         violation: {
  //             directive: e.violatedDirective,
  //             policy: e.originalPolicy,
  //             blocked: e.blockedURI,
  //             timestamp: new Date().toISOString()
  //         }
  //     })
  // });
});
