// Global variables
let currentStep = 1;
const totalSteps = 9;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateProgress();
});

function initializeApp() {
    // Show the first step
    showStep(1);
    
    // Setup form validations
    setupFormValidations();
    
    // Setup password toggles
    setupPasswordToggles();
    
    // Setup country search
    setupCountrySearch();
    
    // Simulate loading states
    setupLoadingStates();
}

function setupEventListeners() {
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', previousStep);
    }
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            nextStep();
        });
    });
    
    // Skip buttons
    const skipBtns = document.querySelectorAll('.skip-btn');
    skipBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep < 7) {
                goToStep(8); // Skip to country selection
            } else {
                nextStep();
            }
        });
    });
    
    // Country selection
    const countryItems = document.querySelectorAll('.country-item');
    countryItems.forEach(item => {
        item.addEventListener('click', function() {
            selectCountry(this);
        });
    });
    
    // Social login buttons (simulate)
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            simulateSocialLogin(this);
        });
    });
}

function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.auth-step');
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    currentStep = stepNumber;
    updateProgress();
    
    // Add entrance animation
    setTimeout(() => {
        if (currentStepElement) {
            currentStepElement.style.opacity = '1';
            currentStepElement.style.transform = 'translateY(0)';
        }
    }, 100);
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Add validation for certain steps
        if (shouldValidateStep(currentStep)) {
            if (!validateCurrentStep()) {
                return; // Don't proceed if validation fails
            }
        }
        
        // Special handling for certain steps
        if (currentStep === 6) {
            // Success screen - auto advance after delay
            setTimeout(() => {
                goToStep(7);
                setTimeout(() => {
                    goToStep(8);
                }, 2000);
            }, 3000);
        } else {
            goToStep(currentStep + 1);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
        showStep(stepNumber);
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    // Update back button visibility
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.opacity = currentStep > 1 ? '1' : '0.5';
        backBtn.disabled = currentStep <= 1;
    }
}

function setupFormValidations() {
    // Real-time validation for form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation rules
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        isValid = phoneRegex.test(value);
    }
    
    if (fieldType === 'password' && value) {
        isValid = value.length >= 6;
        updatePasswordStrength(field);
    }
    
    // Apply styling based on validation
    if (!isValid && value) {
        field.classList.add('error');
    }
    
    return isValid;
}

function shouldValidateStep(stepNumber) {
    // Steps that require validation before proceeding
    return [2, 3, 4, 5].includes(stepNumber);
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    // Special validation for password confirmation
    const password = currentStepElement.querySelector('input[type="password"]');
    const confirmPassword = currentStepElement.querySelector('input[type="password"]:last-of-type');
    
    if (password && confirmPassword && password !== confirmPassword) {
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('error');
            allValid = false;
        }
    }
    
    return allValid;
}

function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

function updatePasswordStrength(passwordField) {
    const password = passwordField.value;
    const strengthContainer = passwordField.closest('.form-group').querySelector('.password-strength');
    
    if (!strengthContainer) return;
    
    const dots = strengthContainer.querySelectorAll('.dot');
    let strength = 0;
    
    // Calculate strength
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index < strength) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function setupCountrySearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const countryItems = document.querySelectorAll('.country-item');
        
        countryItems.forEach(item => {
            const countryName = item.querySelector('.country-name').textContent.toLowerCase();
            const countryCode = item.querySelector('.country-code').textContent.toLowerCase();
            
            if (countryName.includes(searchTerm) || countryCode.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function selectCountry(countryElement) {
    // Remove previous selections
    const countryItems = document.querySelectorAll('.country-item');
    countryItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    // Select current country
    countryElement.classList.add('selected');
    
    // Get country details
    const countryName = countryElement.querySelector('.country-name').textContent;
    const countryCode = countryElement.querySelector('.country-code').textContent;
    const countryFlag = countryElement.querySelector('.country-flag').className;
    
    // Update search container to show selection
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.innerHTML = `
            <div class="selected-country">
                <div class="search-icon">🔍</div>
                <div class="${countryFlag}"></div>
                <span class="country-name">${countryName}</span>
            </div>
        `;
        searchContainer.classList.add('selected');
    }
    
    // Enable continue button
    const continueBtn = document.querySelector('#step8 .continue-btn, #step9 .continue-btn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
    
    // If we're on step 8, move to step 9 to show the selection
    if (currentStep === 8) {
        setTimeout(() => {
            goToStep(9);
        }, 500);
    }
}

function simulateSocialLogin(button) {
    const originalText = button.textContent;
    button.textContent = 'Connecting...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Simulate successful login - go to profile completion
        goToStep(2);
    }, 2000);
}

function setupLoadingStates() {
    // Add loading states to buttons when clicked
    const buttons = document.querySelectorAll('.continue-btn, .primary-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
            }, 1000);
        });
    });
}

function completeFlow() {
    // Show success message and redirect or complete the flow
    showStep(6); // Show success modal
    
    setTimeout(() => {
        // Simulate completion
        alert('Authentication flow completed! Welcome to the platform.');
        // In a real app, you would redirect to the dashboard
        // window.location.href = '/dashboard';
    }, 3000);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const activeStep = document.querySelector('.auth-step.active');
        const continueBtn = activeStep?.querySelector('.continue-btn, .primary-btn');
        if (continueBtn && !continueBtn.disabled) {
            continueBtn.click();
        }
    }
    
    if (e.key === 'Escape') {
        if (currentStep > 1) {
            previousStep();
        }
    }
});

// Auto-save form data (basic implementation)
function autoSaveFormData() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const key = `authFlow_${this.id || this.name}`;
            localStorage.setItem(key, this.value);
        });
    });
}

// Load saved form data
function loadSavedFormData() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        const key = `authFlow_${input.id || input.name}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue && input.type !== 'password') {
            input.value = savedValue;
        }
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    autoSaveFormData();
    loadSavedFormData();
});

// Export functions for global access
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.completeFlow = completeFlow;