/**
 * ==========================================
 * MOONLIT CAFÉ - API Simulation
 * Full Stack Development Assignment
 * ==========================================
 * 
 * This file simulates back-end API calls to demonstrate
 * Full Stack development concepts including:
 * - RESTful API endpoints
 * - CRUD operations (Create, Read, Update, Delete)
 * - Async/Await with simulated network delay
 * - Error handling
 * - Data persistence simulation
 * ==========================================
 */

'use strict';

// ==========================================
// API SIMULATION CLASS
// ==========================================
class APISimulation {
    constructor() {
        // Simulated in-memory database
        this.orders = [];
        this.products = [
            { id: 1, name: 'Butter Croissant', price: 4.50, category: 'pastries' },
            { id: 2, name: 'Pain au Chocolat', price: 5.00, category: 'pastries' },
            { id: 3, name: 'Artisan Sourdough', price: 7.00, category: 'bread' },
            { id: 4, name: 'Vanilla Latte', price: 5.50, category: 'drinks' },
            { id: 5, name: 'New York Cheesecake', price: 6.50, category: 'cakes' },
            { id: 6, name: 'Earl Grey Tea', price: 3.50, category: 'drinks' }
        ];
        
        // Generate some sample orders
        this.generateSampleOrders();
    }

    // ==========================================
    // SIMULATE NETWORK DELAY
    // ==========================================
    async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================
    // GENERATE SAMPLE DATA
    // ==========================================
    generateSampleOrders() {
        const sampleOrders = [
            {
                id: 'ORD-2026-001',
                items: [
                    { name: 'Butter Croissant', quantity: 2, price: 4.50 },
                    { name: 'Vanilla Latte', quantity: 1, price: 5.50 }
                ],
                total: 14.50,
                customer: { name: 'John Doe', email: 'john@example.com' },
                status: 'completed',
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
            },
            {
                id: 'ORD-2026-002',
                items: [
                    { name: 'Artisan Sourdough', quantity: 1, price: 7.00 },
                    { name: 'Earl Grey Tea', quantity: 2, price: 3.50 }
                ],
                total: 14.00,
                customer: { name: 'Jane Smith', email: 'jane@example.com' },
                status: 'pending',
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 'ORD-2026-003',
                items: [
                    { name: 'New York Cheesecake', quantity: 1, price: 6.50 },
                    { name: 'Pain au Chocolat', quantity: 3, price: 5.00 }
                ],
                total: 21.50,
                customer: { name: 'Alex Wong', email: 'alex@example.com' },
                status: 'confirmed',
                createdAt: new Date().toISOString()
            }
        ];
        
        this.orders = sampleOrders;
    }

    // ==========================================
    // GET ALL PRODUCTS (READ)
    // ==========================================
    async getProducts() {
        await this.delay(300);
        return {
            success: true,
            data: this.products,
            count: this.products.length,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // GET PRODUCT BY ID (READ)
    // ==========================================
    async getProductById(id) {
        await this.delay(200);
        const product = this.products.find(p => p.id === id);
        
        if (!product) {
            return {
                success: false,
                error: 'Product not found',
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            success: true,
            data: product,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // CREATE NEW ORDER (CREATE)
    // ==========================================
    async createOrder(orderData) {
        await this.delay(800);
        
        // Validate order data
        if (!orderData.items || !orderData.customer) {
            return {
                success: false,
                error: 'Missing required fields: items and customer',
                timestamp: new Date().toISOString()
            };
        }
        
        // Calculate total
        const total = orderData.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        // Generate order ID
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        
        // Create new order
        const newOrder = {
            id: orderId,
            items: orderData.items,
            total: total,
            customer: orderData.customer,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save to "database"
        this.orders.unshift(newOrder);
        
        return {
            success: true,
            data: newOrder,
            message: 'Order created successfully!',
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // GET ALL ORDERS (READ)
    // ==========================================
    async getOrders() {
        await this.delay(400);
        return {
            success: true,
            data: this.orders,
            count: this.orders.length,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // GET ORDER BY ID (READ)
    // ==========================================
    async getOrderById(orderId) {
        await this.delay(250);
        const order = this.orders.find(o => o.id === orderId);
        
        if (!order) {
            return {
                success: false,
                error: 'Order not found',
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            success: true,
            data: order,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // UPDATE ORDER STATUS (UPDATE)
    // ==========================================
    async updateOrderStatus(orderId, status) {
        await this.delay(600);
        
        const order = this.orders.find(o => o.id === orderId);
        
        if (!order) {
            return {
                success: false,
                error: 'Order not found',
                timestamp: new Date().toISOString()
            };
        }
        
        // Valid statuses
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return {
                success: false,
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
                timestamp: new Date().toISOString()
            };
        }
        
        const oldStatus = order.status;
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        return {
            success: true,
            data: order,
            message: `Order status updated from '${oldStatus}' to '${status}'`,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // DELETE ORDER (DELETE)
    // ==========================================
    async deleteOrder(orderId) {
        await this.delay(500);
        
        const index = this.orders.findIndex(o => o.id === orderId);
        
        if (index === -1) {
            return {
                success: false,
                error: 'Order not found',
                timestamp: new Date().toISOString()
            };
        }
        
        const deletedOrder = this.orders[index];
        this.orders.splice(index, 1);
        
        return {
            success: true,
            data: deletedOrder,
            message: 'Order deleted successfully!',
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // GET ORDER STATISTICS (Aggregate)
    // ==========================================
    async getOrderStats() {
        await this.delay(300);
        
        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        const statusCounts = {
            pending: this.orders.filter(o => o.status === 'pending').length,
            confirmed: this.orders.filter(o => o.status === 'confirmed').length,
            preparing: this.orders.filter(o => o.status === 'preparing').length,
            ready: this.orders.filter(o => o.status === 'ready').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length
        };
        
        // Most popular items
        const itemCounts = {};
        this.orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.name]) {
                    itemCounts[item.name] = 0;
                }
                itemCounts[item.name] += item.quantity;
            });
        });
        
        const popularItems = Object.entries(itemCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));
        
        return {
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue.toFixed(2),
                statusCounts,
                popularItems,
                averageOrderValue: (totalOrders > 0 ? (totalRevenue / totalOrders) : 0).toFixed(2)
            },
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // SEARCH PRODUCTS (Filter)
    // ==========================================
    async searchProducts(query) {
        await this.delay(250);
        
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            return {
                success: true,
                data: this.products,
                count: this.products.length,
                timestamp: new Date().toISOString()
            };
        }
        
        const results = this.products.filter(product => {
            return product.name.toLowerCase().includes(searchTerm) ||
                   product.category.toLowerCase().includes(searchTerm);
        });
        
        return {
            success: true,
            data: results,
            count: results.length,
            query: query,
            timestamp: new Date().toISOString()
        };
    }
}

// ==========================================
// EXPORT INSTANCE (Global)
// ==========================================
const api = new APISimulation();

// Make it globally available
window.api = api;

// ==========================================
// DEMO FUNCTIONS (For testing)
// ==========================================

// Test the API in console
async function testAPI() {
    console.log('🌙 Testing API Simulation...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
        // 1. Get all products
        console.log('📦 Fetching products...');
        const products = await api.getProducts();
        console.log('Products:', products.data.length, 'items found');
        
        // 2. Create an order
        console.log('🛒 Creating order...');
        const newOrder = await api.createOrder({
            items: [
                { name: 'Butter Croissant', quantity: 3, price: 4.50 },
                { name: 'Vanilla Latte', quantity: 2, price: 5.50 }
            ],
            customer: {
                name: 'Demo User',
                email: 'demo@example.com'
            }
        });
        console.log('Order created:', newOrder.data.id);
        
        // 3. Get all orders
        console.log('📋 Fetching orders...');
        const orders = await api.getOrders();
        console.log('Orders:', orders.count, 'total orders');
        
        // 4. Get order stats
        console.log('📊 Fetching stats...');
        const stats = await api.getOrderStats();
        console.log('Stats:', stats.data);
        
        // 5. Search products
        console.log('🔍 Searching for "latte"...');
        const searchResults = await api.searchProducts('latte');
        console.log('Search results:', searchResults.count, 'items found');
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ API Simulation test complete!');
        
    } catch (error) {
        console.error('❌ API Error:', error);
    }
}

// Run test when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌙 API Simulation loaded!');
    console.log('💡 Type "testAPI()" in console to run a test.');
});

console.log('📡 API Simulation ready!');