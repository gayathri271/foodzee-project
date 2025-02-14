
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Use the same Firebase config as your home.js
const firebaseConfig = {
    apiKey: "AIzaSyDt2TyQsktS4hvEwNvWekeUweCAA0NFBX0",
    authDomain: "foodiezproject.firebaseapp.com",
    projectId: "foodiezproject",
    storageBucket: "foodiezproject.appspot.com",
    messagingSenderId: "832548225440",
    appId: "1:832548225440:web:b902256b6183568ff624c5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to display cart items
function displayCartItems(items) {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let total = 0;
    
    cartContainer.innerHTML = '';
    
    Object.entries(items || {}).forEach(([key, item]) => {
        total += item.price * item.quantity;
        
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.title}" class="cart-image">
                    </div>
                    <div class="col-md-4">
                        <h5>${item.title}</h5>
                        <p class="text-muted">₹${item.price}</p>
                    </div>
                    <div class="col-md-4">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${key}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${key}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-danger" onclick="removeItem('${key}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Listen for cart changes
const cartRef = ref(database, 'cart');
onValue(cartRef, (snapshot) => {
    const data = snapshot.val();
    displayCartItems(data);
});

// Add these functions to window object so they can be called from HTML
window.updateQuantity = async function(itemKey, newQuantity) {
    if (newQuantity < 1) return;
    
    const itemRef = ref(database, `cart/${itemKey}`);
    await update(itemRef, { quantity: newQuantity });
};

window.removeItem = async function(itemKey) {
    const itemRef = ref(database, `cart/${itemKey}`);
    await remove(itemRef);
};

window.checkout = function() {
    alert('Checkout functionality will be implemented here');
    // Implement your checkout logic here
};