// Default Products Data
const defaultProducts = [
    {
        id: 1,
        name: "Professional Tripod Stand",
        price: 150.00,
        category: "accessories",
        description: "Heavy-duty tripod stand for cameras and phones",
        image: "",
        stock: 10
    },
    {
        id: 2,
        name: "Stainless Steel Water Bottle Set",
        price: 85.00,
        category: "kitchen",
        description: "Set of 2 insulated water bottles",
        image: "",
        stock: 15
    },
    {
        id: 3,
        name: "Electric Tea Kettle",
        price: 120.00,
        category: "kitchen",
        description: "Fast boiling electric kettle 1.8L",
        image: "",
        stock: 8
    },
    {
        id: 4,
        name: "Ceramic Mug Set with Electric Saucer",
        price: 95.00,
        category: "kitchen",
        description: "4pc mug set with warming saucer",
        image: "",
        stock: 12
    },
    {
        id: 5,
        name: "Electric Cleaning Brush",
        price: 180.00,
        category: "electronics",
        description: "Cordless electric brush for home cleaning",
        image: "",
        stock: 6
    },
    {
        id: 6,
        name: "High-Quality Pen Set",
        price: 45.00,
        category: "office",
        description: "Set of 10 premium ballpoint pens",
        image: "",
        stock: 25
    },
    {
        id: 7,
        name: "Ergonomic Gaming Chair",
        price: 450.00,
        category: "furniture",
        description: "Comfortable gaming chair with lumbar support",
        image: "",
        stock: 4
    },
    {
        id: 8,
        name: "Electric Kettle with Temperature Control",
        price: 165.00,
        category: "kitchen",
        description: "Digital temperature control electric kettle",
        image: "",
        stock: 7
    },
    {
        id: 9,
        name: "USB Charging Hub",
        price: 75.00,
        category: "electronics",
        description: "6-port USB charging station",
        image: "",
        stock: 20
    },
    {
        id: 10,
        name: "Wireless Mouse",
        price: 85.00,
        category: "electronics",
        description: "Ergonomic wireless mouse",
        image: "",
        stock: 18
    },
    {
        id: 11,
        name: "Desktop Organizer with Pen Holder",
        price: 55.00,
        category: "office",
        description: "Multi-compartment desk organizer",
        image: "",
        stock: 14
    },
    {
        id: 12,
        name: "Phone Tripod with Bluetooth Remote",
        price: 65.00,
        category: "accessories",
        description: "Flexible phone tripod with shutter remote",
        image: "",
        stock: 22
    }
];

// Default Settings
const defaultSettings = {
    siteName: "HotDealsCorner",
    phone: "+233 20 000 0000",
    email: "contact@hotdealscorner.com",
    whatsapp: "+233 20 000 0000",
    address: "Ghana",
    announcement: "Welcome to HotDealsCorner - Best Deals in Ghana!",
    adminPassword: "",
    defaultDeliveryPrice: 15,
    momoNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: ""
};

// State
let products = [];
let cart = [];
let orders = [];
let messages = [];
let settings = {};
let customers = [];
let currentCustomer = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderProducts();
    updateCartUI();
    updateContactInfo();
    checkCustomerLogin();
});

// Data Management
function loadData() {
    const savedProducts = localStorage.getItem('hotdeals_products');
    const savedCart = localStorage.getItem('hotdeals_cart');
    const savedOrders = localStorage.getItem('hotdeals_orders');
    const savedMessages = localStorage.getItem('hotdeals_messages');
    const savedSettings = localStorage.getItem('hotdeals_settings');
    const savedCustomers = localStorage.getItem('hotdeals_customers');
    const savedCurrentCustomer = localStorage.getItem('hotdeals_current_customer');

    products = savedProducts ? JSON.parse(savedProducts) : [...defaultProducts];
    cart = savedCart ? JSON.parse(savedCart) : [];
    orders = savedOrders ? JSON.parse(savedOrders) : [];
    messages = savedMessages ? JSON.parse(savedMessages) : [];
    settings = savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
    customers = savedCustomers ? JSON.parse(savedCustomers) : [];
    currentCustomer = savedCurrentCustomer ? JSON.parse(savedCurrentCustomer) : null;

    if (!savedProducts) {
        saveData('hotdeals_products', products);
    }
    if (!savedSettings) {
        saveData('hotdeals_settings', settings);
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Product Functions
function renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productsGrid');
    const displayProducts = filteredProducts || products;

    if (displayProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    grid.innerHTML = displayProducts.map(product => {
        const imageHtml = product.image && product.image.startsWith('data:image') 
            ? `<img src="${product.image}" alt="${product.name}">`
            : product.image 
                ? `<img src="${product.image}" alt="${product.name}">`
                : `<i class="fas fa-box"></i>`;
        
        return `
        <div class="product-card">
            <div class="product-image">
                ${imageHtml}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3>${product.name}</h3>
                <p class="product-price">GHS ${product.price.toFixed(2)}</p>
                <p class="product-stock ${getStockClass(product.stock)}">
                    ${getStockStatus(product.stock)}
                </p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="buy-now" onclick="buyNow(${product.id})">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function getCategoryName(category) {
    const categories = {
        electronics: "Electrical Appliances",
        kitchen: "Kitchen & Dining",
        office: "Pens & Office",
        furniture: "Gaming Chairs",
        accessories: "Tripod Stands",
        other: "Other"
    };
    return categories[category] || category;
}

function getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 3) return 'low-stock';
    return '';
}

function getStockStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 3) return `Only ${stock} left!`;
    return `In Stock (${stock})`;
}

function filterCategory(category) {
    if (category === 'all') {
        renderProducts();
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        renderProducts();
        return;
    }
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
}

function filterByPrice() {
    const priceRange = document.getElementById('priceFilter').value;
    let filtered = products;

    if (priceRange !== 'all') {
        if (priceRange === '200+') {
            filtered = products.filter(p => p.price >= 200);
        } else {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = products.filter(p => p.price >= min && p.price <= max);
        }
    }
    renderProducts(filtered);
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showToast('Maximum stock reached!', 'error');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveData('hotdeals_cart', cart);
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveData('hotdeals_cart', cart);
    updateCartUI();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item) {
        const newQty = item.quantity + change;
        if (newQty > 0 && newQty <= product.stock) {
            item.quantity = newQty;
        } else if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    
    saveData('hotdeals_cart', cart);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `GHS ${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
        const itemImage = item.image && item.image.startsWith('data:image')
            ? `<img src="${item.image}" style="width:70px;height:70px;border-radius:10px;object-fit:cover;">`
            : item.image
                ? `<img src="${item.image}" style="width:70px;height:70px;border-radius:10px;object-fit:cover;">`
                : `<i class="fas fa-box" style="color:#ffb3c6;font-size:24px;"></i>`;
        
        return `
            <div class="cart-item">
                <div class="product-image" style="width:70px;height:70px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#fff5f7;overflow:hidden;">
                    ${itemImage}
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>GHS ${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `}).join('');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

function buyNow(productId) {
    addToCart(productId);
    toggleCart();
}

// Checkout Functions
function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    if (currentCustomer) {
        document.getElementById('checkoutName').value = currentCustomer.name;
        document.getElementById('checkoutPhone').value = currentCustomer.phone;
        document.getElementById('checkoutEmail').value = currentCustomer.email || '';
    } else {
        document.getElementById('checkoutName').value = '';
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutEmail').value = '';
        document.getElementById('checkoutAddress').value = '';
    }

    document.getElementById('checkoutModal').classList.add('active');
    renderCheckoutItems();
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let itemsHtml = cart.map(item => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0d9e3;">
            <span>${item.name} x${item.quantity}</span>
            <span>GHS ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    if (deliveryPrice > 0) {
        const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
        const methodName = deliveryMethod === 'uber' ? 'Uber Delivery' : deliveryMethod === 'bolt' ? 'Bolt Delivery' : 'Delivery';
        itemsHtml += `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0d9e3;">
                <span>${methodName}</span>
                <span>GHS ${deliveryPrice.toFixed(2)}</span>
            </div>
        `;
    }

    checkoutItems.innerHTML = itemsHtml;
    checkoutTotal.textContent = `GHS ${(total + deliveryPrice).toFixed(2)}`;
}

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', updatePaymentDetails);
});

document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', toggleDelivery);
});

let deliveryFee = 0;

let deliveryPrice = 0;

function toggleDelivery() {
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    const deliveryInfo = document.getElementById('deliveryInfo');
    const priceSection = document.getElementById('deliveryPriceSection');
    let info = '';

    switch(deliveryMethod) {
        case 'pickup':
            deliveryPrice = 0;
            document.getElementById('deliveryPriceInput').value = '';
            info = `
                <p><strong>Pickup from Shop</strong></p>
                <p>Come Pickup your order at: ${settings.address}</p>
                <p>Contact: ${settings.phone}</p>
            `;
            priceSection.style.display = 'none';
            break;
        case 'uber':
            deliveryPrice = settings.defaultDeliveryPrice || 15;
            document.getElementById('deliveryPriceInput').value = deliveryPrice;
            info = `
                <p><strong>Uber Delivery</strong></p>
                <p>We will send an Uber driver to deliver your order.</p>
            `;
            priceSection.style.display = 'block';
            break;
        case 'bolt':
            deliveryPrice = settings.defaultDeliveryPrice || 15;
            document.getElementById('deliveryPriceInput').value = deliveryPrice;
            info = `
                <p><strong>Bolt Delivery</strong></p>
                <p>We will send a Bolt driver to deliver your order.</p>
            `;
            priceSection.style.display = 'block';
            break;
    }

    deliveryInfo.innerHTML = info;
    renderCheckoutItems();
}

function updateDeliveryPrice() {
    deliveryPrice = parseFloat(document.getElementById('deliveryPriceInput').value) || 0;
    renderCheckoutItems();
}

function updatePaymentDetails() {
    renderCheckoutItems();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentInfo = document.getElementById('paymentDetails');
    let info = '';

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalWithDelivery = cartTotal + deliveryPrice;

    switch(paymentMethod) {
        case 'mobile_money':
            if (settings.momoNumber) {
                info = `
                    <p><strong>MTN Mobile Money</strong></p>
                    <p>Send GHS <strong>${totalWithDelivery.toFixed(2)}</strong> to:</p>
                    <p style="font-size: 20px; font-weight: bold; color: #ff6b9d; margin: 10px 0;">${settings.momoNumber}</p>
                    <p>Account Name: ${settings.siteName}</p>
                    <p style="color: #27ae60; margin-top: 10px;">✓ After sending, reply with your transaction ID on WhatsApp</p>
                `;
            } else {
                info = `<p>Mobile Money payment not available yet. Contact shop.</p>`;
            }
            break;
        case 'bank_transfer':
            if (settings.bankName && settings.accountNumber) {
                info = `
                    <p><strong>Bank Transfer</strong></p>
                    <p>Transfer GHS <strong>${totalWithDelivery.toFixed(2)}</strong> to:</p>
                    <p style="margin-top: 10px;"><strong>Bank:</strong> ${settings.bankName}</p>
                    <p><strong>Account Name:</strong> ${settings.accountName}</p>
                    <p><strong>Account Number:</strong> <span style="font-size: 18px; font-weight: bold;">${settings.accountNumber}</span></p>
                    <p style="color: #27ae60; margin-top: 10px;">✓ Send proof of payment to WhatsApp</p>
                `;
            } else {
                info = `<p>Bank transfer not available yet. Contact shop.</p>`;
            }
            break;
        case 'cash_on_delivery':
            info = `
                <p><strong>Cash on Delivery</strong></p>
                <p>Pay with cash when your order is delivered.</p>
                <p>Total to pay: <strong>GHS ${totalWithDelivery.toFixed(2)}</strong></p>
            `;
            break;
    }

    paymentInfo.innerHTML = info;
}

function processCheckout(event) {
    event.preventDefault();

    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryPrice;

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: document.getElementById('checkoutName').value,
            phone: document.getElementById('checkoutPhone').value,
            email: document.getElementById('checkoutEmail').value,
            address: document.getElementById('checkoutAddress').value
        },
        payment: document.querySelector('input[name="payment"]:checked').value,
        delivery: deliveryMethod,
        deliveryPrice: deliveryPrice,
        items: [...cart],
        total: orderTotal,
        status: 'pending'
    };

    orders.push(order);
    saveData('hotdeals_orders', orders);

    // Update stock
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    saveData('hotdeals_products', products);

    // Clear cart
    cart = [];
    saveData('hotdeals_cart', cart);
    updateCartUI();

    closeCheckout();
    showToast('Order placed successfully! We will contact you soon.', 'success');
    renderProducts();
}

// Contact Functions
function sendMessage(event) {
    event.preventDefault();

    const message = {
        id: Date.now(),
        date: new Date().toISOString(),
        name: document.getElementById('messageName').value,
        email: document.getElementById('messageEmail').value,
        phone: document.getElementById('messagePhone').value,
        text: document.getElementById('messageText').value
    };

    messages.push(message);
    saveData('hotdeals_messages', messages);

    document.getElementById('messageName').value = '';
    document.getElementById('messageEmail').value = '';
    document.getElementById('messagePhone').value = '';
    document.getElementById('messageText').value = '';

    showToast('Message sent successfully!', 'success');
}

function updateContactInfo() {
    document.getElementById('contactPhone').textContent = settings.phone;
    document.getElementById('contactEmail').textContent = settings.email;
    document.getElementById('contactAddress').textContent = settings.address;
    document.getElementById('contactWhatsapp').textContent = settings.whatsapp;

    document.getElementById('footerPhone').textContent = settings.phone;
    document.getElementById('footerEmail').textContent = settings.email;
    document.getElementById('footerAddress').textContent = settings.address;

    document.getElementById('announcementText').textContent = settings.announcement;

    // Admin form
    document.getElementById('adminSiteName').value = settings.siteName;
    document.getElementById('adminPhone').value = settings.phone;
    document.getElementById('adminEmail').value = settings.email;
    document.getElementById('adminWhatsapp').value = settings.whatsapp;
    document.getElementById('adminAddress').value = settings.address;
    document.getElementById('adminAnnouncement').value = settings.announcement;
    document.getElementById('defaultDeliveryPrice').value = settings.defaultDeliveryPrice || 15;
    
    if (settings.momoNumber) document.getElementById('adminMomoNumber').value = settings.momoNumber;
    if (settings.bankName) document.getElementById('adminBankName').value = settings.bankName;
    if (settings.accountName) document.getElementById('adminAccountName').value = settings.accountName;
    if (settings.accountNumber) document.getElementById('adminAccountNumber').value = settings.accountNumber;
}

// Admin Functions
function showAdminTab(tab) {
    document.querySelectorAll('.admin-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.admin-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });

    document.getElementById(`admin-${tab}`).style.display = 'block';
    event.target.classList.add('active');

    if (tab === 'products') {
        renderAdminProducts();
    } else if (tab === 'orders') {
        renderAdminOrders();
    } else if (tab === 'messages') {
        renderAdminMessages();
    }
}

function saveSettings(event) {
    event.preventDefault();

    const newPassword = document.getElementById('adminPassword').value;
    
    settings = {
        siteName: document.getElementById('adminSiteName').value,
        phone: document.getElementById('adminPhone').value,
        email: document.getElementById('adminEmail').value,
        whatsapp: document.getElementById('adminWhatsapp').value,
        address: document.getElementById('adminAddress').value,
        announcement: document.getElementById('adminAnnouncement').value,
        adminPassword: newPassword || settings.adminPassword,
        defaultDeliveryPrice: parseFloat(document.getElementById('defaultDeliveryPrice').value) || 15,
        momoNumber: document.getElementById('adminMomoNumber').value,
        bankName: document.getElementById('adminBankName').value,
        accountName: document.getElementById('adminAccountName').value,
        accountNumber: document.getElementById('adminAccountNumber').value
    };

    saveData('hotdeals_settings', settings);
    updateContactInfo();

    document.getElementById('siteTitle').textContent = settings.siteName;
    document.title = `${settings.siteName} - Your One-Stop Shop`;

    showToast('Settings saved successfully!', 'success');
}

function addProduct(event) {
    event.preventDefault();

    const imageBase64 = document.getElementById('productImageBase64').value;

    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: imageBase64,
        stock: parseInt(document.getElementById('productStock').value)
    };

    products.push(newProduct);
    saveData('hotdeals_products', products);

    event.target.reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('productImageBase64').value = '';
    renderProducts();
    showToast('Product added successfully!', 'success');
}

function previewProductImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('productImageBase64').value = e.target.result;
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeProductImage() {
    document.getElementById('productImage').value = '';
    document.getElementById('productImageBase64').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    list.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p>GHS ${product.price.toFixed(2)} | ${getCategoryName(product.category)} | Stock: ${product.stock}</p>
            </div>
            <div class="admin-product-actions">
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveData('hotdeals_products', products);
        renderProducts();
        renderAdminProducts();
        showToast('Product deleted!', 'success');
    }
}

function renderAdminOrders() {
    const list = document.getElementById('ordersList');
    if (orders.length === 0) {
        list.innerHTML = '<p>No orders yet</p>';
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h4>Order #${order.id}</h4>
                <p>${order.customer.name} | ${order.customer.phone}</p>
                <p>Total: GHS ${order.total.toFixed(2)} | Payment: ${order.payment.replace('_', ' ')}</p>
                <p>Items: ${order.items.map(i => `${i.name}x${i.quantity}`).join(', ')}</p>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="updateOrderStatus(${order.id}, 'completed')">
                    Mark Complete
                </button>
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        saveData('hotdeals_orders', orders);
        renderAdminOrders();
        showToast('Order status updated!', 'success');
    }
}

function renderAdminMessages() {
    const list = document.getElementById('messagesList');
    if (messages.length === 0) {
        list.innerHTML = '<p>No messages yet</p>';
        return;
    }

    list.innerHTML = messages.map(msg => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h4>${msg.name}</h4>
                <p>${msg.email} | ${msg.phone}</p>
                <p>${msg.text}</p>
                <small>${new Date(msg.date).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

// Announcement
function closeAnnouncement() {
    document.getElementById('announcementBar').style.display = 'none';
}

// Admin Login Functions
function checkAdminAccess(event) {
    event.preventDefault();
    const password = settings.adminPassword;
    if (!password || password === '') {
        document.getElementById('adminLoginModal').classList.add('active');
    } else {
        document.getElementById('adminLoginModal').classList.add('active');
    }
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('adminPasswordInput').value = '';
}

function verifyAdminPassword(event) {
    event.preventDefault();
    const inputPassword = document.getElementById('adminPasswordInput').value;
    
    if (inputPassword === settings.adminPassword) {
        closeAdminLogin();
        document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
        showToast('Welcome to Admin Panel!', 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Customer Login Functions
function showCustomerLogin(event) {
    if (event) event.preventDefault();
    document.getElementById('customerLoginModal').classList.add('active');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function closeCustomerLogin() {
    document.getElementById('customerLoginModal').classList.remove('active');
}

function showRegisterForm(event) {
    event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm(event) {
    event.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function customerRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    const existingCustomer = customers.find(c => c.phone === phone || c.email === email);
    if (existingCustomer) {
        showToast('Account already exists with this phone/email!', 'error');
        return;
    }

    const newCustomer = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    saveData('hotdeals_customers', customers);
    
    currentCustomer = newCustomer;
    saveData('hotdeals_current_customer', currentCustomer);
    
    document.getElementById('regName').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';

    closeCustomerLogin();
    checkCustomerLogin();
    showToast('Account created successfully!', 'success');
}

function customerLogin(event) {
    event.preventDefault();
    
    const identity = document.getElementById('loginIdentity').value;
    const password = document.getElementById('loginPassword').value;

    const customer = customers.find(c => 
        (c.phone === identity || c.email === identity) && c.password === password
    );

    if (customer) {
        currentCustomer = customer;
        saveData('hotdeals_current_customer', currentCustomer);
        
        document.getElementById('loginIdentity').value = '';
        document.getElementById('loginPassword').value = '';
        
        closeCustomerLogin();
        checkCustomerLogin();
        showToast('Welcome back, ' + customer.name + '!', 'success');
    } else {
        showToast('Invalid phone/email or password!', 'error');
    }
}

function checkCustomerLogin() {
    if (currentCustomer) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('userSection').style.display = 'block';
        document.getElementById('userName').textContent = currentCustomer.name.split(' ')[0];
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('userSection').style.display = 'none';
    }
}

function showCustomerAccount(event) {
    event.preventDefault();
    if (!currentCustomer) {
        showCustomerLogin(event);
        return;
    }

    document.getElementById('accName').textContent = currentCustomer.name;
    document.getElementById('accPhone').textContent = currentCustomer.phone;
    document.getElementById('accEmail').textContent = currentCustomer.email || 'Not set';

    const customerOrders = orders.filter(o => o.customer.phone === currentCustomer.phone);
    const ordersList = document.getElementById('customerOrders');
    
    if (customerOrders.length === 0) {
        ordersList.innerHTML = '<p style="color: #7f8c8d; text-align: center;">No orders yet</p>';
    } else {
        ordersList.innerHTML = customerOrders.map(order => `
            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                <p style="font-weight: bold;">Order #${order.id}</p>
                <p style="font-size: 14px; color: #7f8c8d;">${new Date(order.date).toLocaleDateString()}</p>
                <p style="font-size: 14px;">Items: ${order.items.map(i => i.name + ' x' + i.quantity).join(', ')}</p>
                <p style="font-weight: bold; color: #ff6b9d;">Total: GHS ${order.total.toFixed(2)}</p>
                <p style="font-size: 13px; color: ${order.status === 'completed' ? '#27ae60' : '#f39c12'};">Status: ${order.status}</p>
            </div>
        `).join('');
    }

    document.getElementById('customerAccountModal').classList.add('active');
}

function closeCustomerAccount() {
    document.getElementById('customerAccountModal').classList.remove('active');
}

function customerLogout() {
    currentCustomer = null;
    localStorage.removeItem('hotdeals_current_customer');
    closeCustomerAccount();
    checkCustomerLogin();
    showToast('Logged out successfully!', 'success');
}