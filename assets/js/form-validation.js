/**
 * ==========================================
 * MOONLIT CAFÉ - Form Validation
 * Full Stack Development Assignment
 * ==========================================
 */

'use strict';

// ==========================================
// VALIDATION PATTERNS
// ==========================================
const VALIDATION = {
    name: {
        regex: /^[A-Za-z\s]{2,}$/,
        message: 'Please enter at least 2 characters (letters only)'
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Please enter a valid email address'
    },
    message: {
        regex: /^.{10,}$/,
        message: 'Please enter at least 10 characters'
    },
    subject: {
        regex: /.+/,
        message: 'Please select a subject'
    }
};

// ==========================================
// FORM VALIDATION CLASS
// ==========================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.fields = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email'),
            subject: this.form.querySelector('#subject'),
            message: this.form.querySelector('#message')
        };
        
        this.successMessage = this.form.querySelector('#formSuccess');
        this.charCount = document.getElementById('charCount');
        
        this.init();
    }
    
    init() {
        // Add real-time validation on blur
        Object.keys(this.fields).forEach(key => {
            const field = this.fields[key];
            if (!field) return;
            
            field.addEventListener('blur', () => this.validateField(key));
            field.addEventListener('input', () => {
                if (field.value.length > 0) {
                    this.validateField(key);
                }
            });
        });
        
        // Char counter for message
        if (this.fields.message && this.charCount) {
            this.fields.message.addEventListener('input', () => {
                const count = this.fields.message.value.length;
                this.charCount.textContent = `${count} / 10 min`;
                this.charCount.className = count >= 10 ? 'text-success' : 'text-danger';
            });
        }
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return false;
        
        const rules = VALIDATION[fieldName];
        if (!rules) return true;
        
        const value = field.value.trim();
        const isValid = rules.regex.test(value);
        
        // Update UI
        field.classList.remove('is-valid', 'is-invalid');
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        // Set custom validity message
        field.setCustomValidity(isValid ? '' : rules.message);
        
        return isValid;
    }
    
    validateAll() {
        let isValid = true;
        Object.keys(this.fields).forEach(key => {
            if (!this.validateField(key)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const isValid = this.validateAll();
        
        if (isValid) {
            // Success
            this.successMessage.classList.remove('d-none');
            this.successMessage.style.animation = 'fadeIn 0.5s ease';
            
            // Log submission (simulating API call)
            const formData = {
                name: this.fields.name.value,
                email: this.fields.email.value,
                subject: this.fields.subject.value,
                message: this.fields.message.value,
                timestamp: new Date().toISOString()
            };
            
            console.log('📧 Form submitted successfully!');
            console.log('Form Data:', formData);
            
            // Simulate API call
            this.simulateAPICall(formData);
            
            // Reset form
            this.form.reset();
            Object.values(this.fields).forEach(field => {
                if (field) field.classList.remove('is-valid', 'is-invalid');
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                this.successMessage.classList.add('d-none');
            }, 5000);
            
            showNotification('Message sent successfully! ✨');
            
        } else {
            // Focus first invalid field
            const firstInvalid = this.form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            showNotification('Please fix the highlighted fields.', 'error');
        }
    }
    
    // ==========================================
    // SIMULATE API CALL (Full Stack Demo)
    // ==========================================
    async simulateAPICall(data) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simulate API response
            const response = {
                success: true,
                messageId: 'MSG-' + Date.now().toString().slice(-6),
                timestamp: new Date().toISOString(),
                data: data
            };
            
            console.log('📡 API Response:', response);
            
            // In a real full-stack app, this would be:
            // const res = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            // const result = await res.json();
            
            return response;
            
        } catch (error) {
            console.error('API Error:', error);
            showNotification('Something went wrong. Please try again.', 'error');
        }
    }
}

// ==========================================
// INITIALIZE FORM
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const validator = new FormValidator('contactForm');
        console.log('📝 Form Validation loaded!');
    }
});