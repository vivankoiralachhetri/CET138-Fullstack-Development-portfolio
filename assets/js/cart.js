/**
 * ==========================================
 * MOONLIT CAFÉ - Shopping Cart
 * Full Stack Development Assignment
 * ==========================================
 */

'use strict';

// ==========================================
// SHOPPING CART CLASS
// ==========================================
class ShoppingCart {
    constructor() {
        this.storageKey = 'moonlit-cart';
        this.items = this.loadFromStorage();
        this.render();
        this.updateBadge();
        
        // Store instance globally for access from other scripts
        window.cartInstance = this;
    }
    
    // ==========================================
    // STORAGE METHODS
    // ==========================================
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }
    
    // ==========================================
    // CART OPERATIONS
    // ==========================================
    addItem(name, price, quantity = 1) {
        const existing = this.items.find(item => item.name === name);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                name: name,
                price: parseFloat(price),
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.render();
        this.updateBadge();
        showNotification(`${name} added to cart! 🛒`);
    }
    
    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveToStorage();
        this.render();
        this.updateBadge();
    }
    
    updateQuantity(name, quantity) {
        const item = this.items.find(item => item.name === name);
        if (!item) return;
        
        item.quantity += quantity;
        
        if (item.quantity <= 0) {
            this.removeItem(name);
            return;
        }
        
        this.saveToStorage();
        this.render();
        this.updateBadge();
    }
    
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // ==========================================
    // RENDER METHODS
    // ==========================================
    render() {
        const container = document.getElementById('cartItems');
        const summary = document.getElementById('cartSummary');
        const totalEl = document.getElementById('cartTotal');
        
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <p class="text-muted text-center">
                    <i class="fas fa-shopping-bag fa-3x d-block mb-3 opacity-25"></i>
                    Your cart is empty.
                </p>
            `;
            if (summary) summary.classList.add('d-none');
            return;
        }
        
        let html = '';
        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 fw-bold">${item.name}</h6>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <button class="btn btn-sm btn-outline-secondary qty-btn" 
                                    data-name="${item.name}" data-change="-1">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="fw-bold min-w-30 text-center">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary qty-btn" 
                                    data-name="${item.name}" data-change="1">
                                <i class="fas fa-plus"></i>
                            </button>
                            <span class="text-muted ms-2">× £${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-gold">£${itemTotal.toFixed(2)}</div>
                        <button class="btn btn-sm btn-outline-danger remove-btn mt-1" 
                                data-name="${item.name}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Update total
        if (totalEl) {
            totalEl.textContent = `£${this.getTotal().toFixed(2)}`;
        }
        
        if (summary) {
            summary.classList.remove('d-none');
        }
        
        // ==========================================
        // EVENT LISTENERS FOR CART ITEMS
        // ==========================================
        container.querySelectorAll('.qty-btn').forEach(btn => {
            btn.removeEventListener('click', this._qtyHandler);
            btn.addEventListener('click', this._qtyHandler = function() {
                const name = this.dataset.name;
                const change = parseInt(this.dataset.change);
                window.cartInstance.updateQuantity(name, change);
            });
        });
        
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.removeEventListener('click', this._removeHandler);
            btn.addEventListener('click', this._removeHandler = function() {
                const name = this.dataset.name;
                window.cartInstance.removeItem(name);
                showNotification(`${name} removed from cart.`, 'warning');
            });
        });
    }
    
    updateBadge() {
        const count = this.getItemCount();
        const badge = document.getElementById('cartCount');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        }
    }
}

// ==========================================
// INITIALIZE CART
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    const cart = new ShoppingCart();
    
    // Cart toggle (open offcanvas)
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const offcanvasElement = document.getElementById('shoppingCart');
            if (offcanvasElement) {
                const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                offcanvas.show();
            }
        });
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = this.dataset.price;
            cart.addItem(name, price);
        });
    });
});

console.log('🛒 Shopping Cart loaded successfully!');