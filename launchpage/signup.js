        // Import Firebase SDK
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
        import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
        
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDt2TyQsktS4hvEwNvWekeUweCAA0NFBX0",
            authDomain: "foodiezproject.firebaseapp.com",
            databaseURL: "https://foodiezproject-default-rtdb.firebaseio.com",
            projectId: "foodiezproject",
            storageBucket: "foodiezproject.firebasestorage.app",
            messagingSenderId: "832548225440",
            appId: "1:832548225440:web:b902256b6183568ff624c5"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getDatabase(app);
        
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("signup-form").addEventListener("submit", async (event) => {
                event.preventDefault();
                
                const name = document.getElementById("signup-name").value;
                const email = document.getElementById("signup-email").value;
                const password = document.getElementById("signup-password").value;
                
                try {
                    // Create user with email and password
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    // Save user data in Realtime Database
                    await set(ref(db, `users/${name}`), {
                        uid: user.uid,
                        name: name,
                        email: email
                    });
                    
                    // Show success message and redirect
                    Swal.fire({
                        title: "Sign Up Successful!",
                        icon: "success",
                    }).then(() => {
                        location.href = "login.html";
                    });
                } catch (error) {
                    console.error("Signup Error:", error); // Log error for debugging
                    Swal.fire({
                        title: "Sign Up Failed",
                        text: error.message,
                        icon: "error",
                    });
                }
            });
        });





