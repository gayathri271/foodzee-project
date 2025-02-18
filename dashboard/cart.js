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
    const cartRef = ref(database, 'cart');
    onValue(cartRef, (snapshot) => {
        const cartItems = snapshot.val();
        if (cartItems && Object.keys(cartItems).length > 0) {
            // Redirect to payment page or show payment form
            window.location.href = 'payment.html'; // Assuming you have a payment.html page
        } else {
            alert('Your cart is empty. Please add items to your cart before proceeding to payment.');
        }
    }, {
        onlyOnce: true
    });
};
window.checkout = function() {
    alert('Checkout functionality will be implemented here');
    // Implement your checkout logic here
};


// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
// const auth = getAuth(app);

// let currentUser = null;

// // Check if user is logged in
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in
//         currentUser = user;
//         loadUserCart();
//     } else {
//         // User is signed out
//         currentUser = null;
//         redirectToLogin();
//     }
// });

// // Function to redirect to login page if not logged in
// function redirectToLogin() {
//     Swal.fire({
//         title: "Please Login",
//         text: "You need to be logged in to view your cart",
//         icon: "warning",
//     }).then(() => {
//         window.location.href = "login.html";
//     });
// }

// // Function to load user's cart
// function loadUserCart() {
//     if (!currentUser) return;
    
//     // Get user's name to use as the database reference
//     get(ref(database, `users`)).then((snapshot) => {
//         const users = snapshot.val();
//         let userName = null;
        
//         // Find the user entry with matching UID
//         Object.entries(users || {}).forEach(([name, userData]) => {
//             if (userData.uid === currentUser.uid) {
//                 userName = name;
//             }
//         });
        
//         if (userName) {
//             // Now we have the user's name, subscribe to their cart
//             const userCartRef = ref(database, `users/${userName}/cart`);
//             onValue(userCartRef, (snapshot) => {
//                 const data = snapshot.val();
//                 displayCartItems(data);
//             });
//         } else {
//             console.error("User not found in database");
//             displayCartItems({});
//         }
//     }).catch(error => {
//         console.error("Error fetching user data:", error);
//         displayCartItems({});
//     });
// }

// // Function to display cart items
// function displayCartItems(items) {
//     const cartContainer = document.getElementById('cartItems');
//     const cartTotal = document.getElementById('cartTotal');
//     let total = 0;
    
//     cartContainer.innerHTML = '';
    
//     if (!items || Object.keys(items).length === 0) {
//         cartContainer.innerHTML = '<div class="alert alert-info">Your cart is empty</div>';
//         cartTotal.textContent = '0.00';
//         return;
//     }
    
//     Object.entries(items).forEach(([key, item]) => {
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

// // Function to get the user's name
// async function getUserName() {
//     if (!currentUser) return null;
    
//     try {
//         const snapshot = await get(ref(database, 'users'));
//         const users = snapshot.val();
        
//         for (const [name, userData] of Object.entries(users || {})) {
//             if (userData.uid === currentUser.uid) {
//                 return name;
//             }
//         }
//         return null;
//     } catch (error) {
//         console.error("Error getting user name:", error);
//         return null;
//     }
// }

// // Add these functions to window object so they can be called from HTML
// window.updateQuantity = async function(itemKey, newQuantity) {
//     if (!currentUser) return;
//     if (newQuantity < 1) return;
    
//     const userName = await getUserName();
//     if (!userName) return;
    
//     const itemRef = ref(database, `users/${userName}/cart/${itemKey}`);
//     await update(itemRef, { quantity: newQuantity });
// };

// window.removeItem = async function(itemKey) {
//     if (!currentUser) return;
    
//     const userName = await getUserName();
//     if (!userName) return;
    
//     const itemRef = ref(database, `users/${userName}/cart/${itemKey}`);
//     await remove(itemRef);
// };

// window.checkout = async function() {
//     if (!currentUser) {
//         redirectToLogin();
//         return;
//     }
    
//     const userName = await getUserName();
//     if (!userName) return;
    
//     // Here you would implement your checkout logic
//     Swal.fire({
//         title: "Proceed to Checkout",
//         text: "This will process your order",
//         icon: "info",
//         showCancelButton: true,
//         confirmButtonText: "Yes, checkout now",
//         cancelButtonText: "Cancel"
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Process the order
//             // For now, just clear the cart
//             remove(ref(database, `users/${userName}/cart`)).then(() => {
//                 Swal.fire({
//                     title: "Order Placed Successfully!",
//                     text: "Thank you for your order",
//                     icon: "success"
//                 });
//             }).catch(error => {
//                 console.error("Error during checkout:", error);
//                 Swal.fire({
//                     title: "Checkout Failed",
//                     text: error.message,
//                     icon: "error"
//                 });
//             });
//         }
//     });
// };


