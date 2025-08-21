/**
 * Secure Form Validation and Handling
 * Example implementation for contact forms or any user input forms
 */

class SecureFormHandler {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.setupFormHandling();
  }

  setupFormHandling() {
    if (!this.form) return;

    // Prevent default form submission and handle securely
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });

    // Add real-time validation to form fields
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type || "text";
    const isRequired = field.hasAttribute("required");

    // Clear previous errors
    this.clearFieldError(field);

    // Define validation rules based on field type
    let validation;
    switch (fieldType) {
      case "email":
        validation = window.SecurityUtils.validateInput(value, {
          type: "email",
          required: isRequired,
          maxLength: 254,
        });
        break;
      case "tel":
        validation = window.SecurityUtils.validateInput(value, {
          required: isRequired,
          maxLength: 20,
        });
        break;
      default:
        if (field.tagName.toLowerCase() === "textarea") {
          validation = window.SecurityUtils.validateInput(value, {
            required: isRequired,
            maxLength: 2000,
            allowHtml: false,
          });
        } else {
          validation = window.SecurityUtils.validateInput(value, {
            required: isRequired,
            maxLength: 100,
            allowHtml: false,
          });
        }
    }

    // Display validation errors
    if (!validation.isValid) {
      this.displayFieldError(field, validation.errors);
      return false;
    }

    // Update field value with sanitized content
    field.value = validation.value;
    return true;
  }

  displayFieldError(field, errors) {
    field.classList.add("error");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = errors[0]; // Show first error
    errorDiv.style.color = "#dc2626";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";

    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  handleFormSubmission() {
    let isFormValid = true;
    const formData = new FormData();

    // Validate all fields
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      } else {
        // Add sanitized data to form
        formData.append(field.name, field.value);
      }
    });

    if (!isFormValid) {
      this.showFormError("Please correct the errors above before submitting.");
      return;
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      formData.append("_token", csrfToken.getAttribute("content"));
    }

    // Submit form securely
    this.submitForm(formData);
  }

  async submitForm(formData) {
    try {
      // Show loading state
      this.setFormLoading(true);

      const response = await fetch(this.form.action, {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        this.showFormSuccess(result.message || "Thank you for your message!");
        this.form.reset();
      } else {
        this.showFormError(
          result.message || "An error occurred. Please try again.",
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFormError(
        "Unable to send message. Please check your connection and try again.",
      );
    } finally {
      this.setFormLoading(false);
    }
  }

  setFormLoading(isLoading) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = isLoading;
      submitButton.textContent = isLoading ? "Sending..." : "Send Message";
    }
  }

  showFormError(message) {
    this.showFormMessage(message, "error");
  }

  showFormSuccess(message) {
    this.showFormMessage(message, "success");
  }

  showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = this.form.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.padding = "1rem";
    messageDiv.style.marginBottom = "1rem";
    messageDiv.style.borderRadius = "0.375rem";
    messageDiv.style.fontSize = "0.875rem";

    if (type === "error") {
      messageDiv.style.backgroundColor = "#fef2f2";
      messageDiv.style.color = "#dc2626";
      messageDiv.style.border = "1px solid #fecaca";
    } else {
      messageDiv.style.backgroundColor = "#f0fdf4";
      messageDiv.style.color = "#166534";
      messageDiv.style.border = "1px solid #bbf7d0";
    }

    window.SecurityUtils.safeSetTextContent(messageDiv, message);
    this.form.insertBefore(messageDiv, this.form.firstChild);

    // Auto-remove success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }
}

// Auto-initialize form handlers when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Look for forms with the 'secure-form' class
  document.querySelectorAll("form.secure-form").forEach((form) => {
    new SecureFormHandler(`#${form.id}`);
  });
});

// Export for manual initialization
window.SecureFormHandler = SecureFormHandler;
