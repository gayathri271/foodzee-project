// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// // Use the same Firebase config as your home.js
// const firebaseConfig = {
//     apiKey: "AIzaSyDt2TyQsktS4hvEwNvWekeUweCAA0NFBX0",
//     authDomain: "foodiezproject.firebaseapp.com",
//     projectId: "foodiezproject",
//     storageBucket: "foodiezproject.appspot.com",
//     messagingSenderId: "832548225440",
//     appId: "1:832548225440:web:b902256b6183568ff624c5"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // Function to display cart items
// function displayCartItems(items) {
//     const cartContainer = document.getElementById('cartItems');
//     const cartTotal = document.getElementById('cartTotal');
//     let total = 0;
    
//     cartContainer.innerHTML = '';
    
//     Object.entries(items || {}).forEach(([key, item]) => {
//         total += item.price * item.quantity;
        
//         cartContainer.innerHTML += `
//             <div class="cart-item">
//                 <div class="row align-items-center">
//                     <div class="col-md-2">
//                         <img src="${item.image}" alt="${item.title}" class="cart-image">
//                     </div>
//                     <div class="col-md-4">
//                         <h5>${item.title}</h5>
//                         <p class="text-muted">₹${item.price}</p>
//                     </div>
//                     <div class="col-md-4">
//                         <div class="quantity-control">
//                             <button class="quantity-btn" onclick="updateQuantity('${key}', ${item.quantity - 1})">-</button>
//                             <span>${item.quantity}</span>
//                             <button class="quantity-btn" onclick="updateQuantity('${key}', ${item.quantity + 1})">+</button>
//                         </div>
//                     </div>
//                     <div class="col-md-2 text-end">
//                         <button class="btn btn-danger" onclick="removeItem('${key}')">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });
    
//     cartTotal.textContent = total.toFixed(2);
// }

// // Listen for cart changes
// const cartRef = ref(database, 'cart');
// onValue(cartRef, (snapshot) => {
//     const data = snapshot.val();
//     displayCartItems(data);
// });

// // Add these functions to window object so they can be called from HTML
// window.updateQuantity = async function(itemKey, newQuantity) {
//     if (newQuantity < 1) return;
    
//     const itemRef = ref(database, `cart/${itemKey}`);
//     await update(itemRef, { quantity: newQuantity });
// };

// window.removeItem = async function(itemKey) {
//     const itemRef = ref(database, `cart/${itemKey}`);
//     await remove(itemRef);
// };

// window.checkout = function() {
//     alert('Checkout functionality will be implemented here');
//     // Implement your checkout logic here
// };

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const auth = getAuth(app);

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

// Fetch and display cart items when user is logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const cartRef = ref(database, `users/${userId}/cart`);
        onValue(cartRef, (snapshot) => {
            const data = snapshot.val();
            displayCartItems(data);
        });
    } else {
        console.log("User not logged in.");
    }
});

// Update item quantity
window.updateQuantity = async function(itemKey, newQuantity) {
    const user = auth.currentUser;
    if (!user || newQuantity < 1) return;

    const userId = user.uid;
    const itemRef = ref(database, `users/${userId}/cart/${itemKey}`);
    await update(itemRef, { quantity: newQuantity });
};

// Remove item from cart
window.removeItem = async function(itemKey) {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const itemRef = ref(database, `users/${userId}/cart/${itemKey}`);
    await remove(itemRef);
};

// Checkout function (to be implemented)
// window.checkout = function() {
//     alert('Checkout functionality will be implemented here');
// };

window.proceedToPay = function() {
    const totalAmount = document.getElementById('cartTotal').textContent;
    document.getElementById('paymentAmount').textContent = totalAmount;
    
    // Show payment modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();

    document.getElementById('payNowBtn').onclick = function() {
        processPayment(totalAmount);
    };
};

function processPayment(amount) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to proceed with payment.");
        return;
    }

    const options = {
        key: "rzp_test_olw8ebpoj8g3Bm", // Replace with your Razorpay API key
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "Foodiez",
        description: "Order Payment",
        handler: function(response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            completeOrder();
        },
        prefill: {
            email: user.email
        },
        theme: {
            color: "#3399cc"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

function completeOrder() {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const cartRef = ref(database, `users/${userId}/cart`);
    const ordersRef = ref(database, `users/${userId}/orders`);

    onValue(cartRef, (snapshot) => {
        const cartData = snapshot.val();
        if (cartData) {
            update(ordersRef, cartData); // Save order details
            remove(cartRef); // Clear cart after order
        }
    });

    alert("Order placed successfully!");
}

