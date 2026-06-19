/**
 * ==========================================
 * MOONLIT CAFÉ - Main JavaScript
 * Full Stack Development Assignment
 * ==========================================
 */

'use strict';

// ==========================================
// 1. DARK MODE TOGGLE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    
    // Check saved preference
    if (localStorage.getItem('moonlit-dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('moonlit-dark-mode', 'enabled');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('moonlit-dark-mode', 'disabled');
        }
    });
});

// ==========================================
// 2. MENU FILTER
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (filterButtons.length === 0 || menuItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            menuItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    // Add animation
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// ==========================================
// 3. SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 4. ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
document.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ==========================================
// 5. UTILITY: SHOW NOTIFICATION
// ==========================================
function showNotification(message, type = 'success') {
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const bgColor = colors[type] || colors.success;
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <div class="p-3 rounded-4 shadow-lg position-fixed bottom-0 end-0 m-3" 
             style="z-index: 9999; background: ${bgColor}; color: white; 
                    min-width: 250px; max-width: 400px; 
                    animation: slideInRight 0.5s ease forwards;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

// ==========================================
// 6. CHAR COUNTER FOR FORM
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count} / 10 min`;
            
            if (count >= 10) {
                charCount.className = 'text-success';
            } else {
                charCount.className = 'text-danger';
            }
        });
    }
});

// ==========================================
// 7. CHECKOUT BUTTON
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const orderModal = document.getElementById('orderModal');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('moonlit-cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'warning');
                return;
            }
            
            // Generate random order number
            const orderNum = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            document.getElementById('orderNumber').textContent = orderNum;
            
            // Show modal
            const modal = new bootstrap.Modal(orderModal);
            modal.show();
            
            // Clear cart
            localStorage.removeItem('moonlit-cart');
            if (window.cartInstance) {
                window.cartInstance.items = [];
                window.cartInstance.render();
                window.cartInstance.updateBadge();
            }
            
            showNotification('Order placed successfully! 🎉');
        });
    }
});

console.log('🌙 Moonlit Café & Bakery - JavaScript loaded successfully!');