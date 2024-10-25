// Import the Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABLZMrwUItOZlIxWhU2iWB1exHGP-6Tts",
    authDomain: "canteen-notification-system.firebaseapp.com",
    projectId: "canteen-notification-system",
    storageBucket: "canteen-notification-system.appspot.com",
    messagingSenderId: "339382331892",
    appId: "1:339382331892:web:16d5cb933325bf848db1a1",
    measurementId: "G-DH9N1ZHLT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to check for permission and get the FCM token
function requestPermission() {
    return new Promise((resolve, reject) => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                resolve(true);
            } else {
                console.log('Unable to get permission to notify.');
                reject(false);
            }
        });
    });
}

// Fetch products function
function fetchProducts() {
    fetch('https://mshssm-canteen.onrender.com/api/products') // Adjust this URL if necessary
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            products = data; // Update the products variable with fetched data
            displayProducts(); // Call the display function to show products on the page
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please try again later.'); // User-friendly error message
        });
}

// Initialize
fetchProducts(); // Call this function to fetch products when the page loads

let products = []; // Initialize products as an empty array
let cart = [];

// Function to display products
function displayProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // Clear existing product list

    products.forEach(product => {
        const productDiv = createProductElement(product);
        productsList.appendChild(productDiv);
    });
}

// Function to create product element
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <div class='pname'>${product.name}</div> <div class='pprice'>₱${product.price}</div>
        <div class='pbutton'><button onclick="addToCart('${product._id}')">Add to Cart</button></div>
    `;
    return productDiv;
}

// Function to add items to cart
function addToCart(productId) {
    const product = products.find(p => p._id === productId); // Match using _id
    const cartItem = cart.find(item => item.productId === productId); // Ensure consistency

    if (cartItem) {
        cartItem.quantity += 1; // Increase quantity if already in cart
    } else {
        // Add new item to cart
        cart.push({ 
            productId: productId, // Using the productId directly
            name: product.name, 
            price: product.price, 
            quantity: 1 
        });
    }
    updateCart(); // Update the cart display
}

// Function to remove items from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId); // Ensure you're filtering correctly
    updateCart();
}

// Function to update cart display and total amount
function updateCart() {
    const cartItems = document.querySelector('#cart-items tbody');
    const totalAmount = document.getElementById('total-amount');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const row = createCartItemElement(item);
        cartItems.appendChild(row);
    });

    totalAmount.innerText = `₱${total.toFixed(2)}`;
}

// Function to create cart item element
function createCartItemElement(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>₱${item.price}</td>
        <td>${item.quantity}</td>
        <td><button onclick="removeFromCart('${item.productId}')">Remove</button></td>
    `;
    return row;
}

// Function to handle order placement
document.getElementById('place-order').addEventListener('click', () => {
    if (cart.length > 0) {
        placeOrder();
    } else {
        alert("Your cart is empty!");
    }
});

// Function to send order to the server
function placeOrder() {
    const token = localStorage.getItem('token');

    if (isTokenExpired(token)) {
        alert('Your session has expired. Please log in again.');
        window.location.href = 'index.html';
        return;
    }

    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';

    const customerName = `${firstName} ${lastName}`.trim();

    fetch('https://mshssm-canteen.onrender.com/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
            customerName // Add customerName to the body
        }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log('Order placed successfully:', data);
        alert('Order placed successfully!');
        cart = []; // Clear the cart after order
        updateCart();
    })
    .catch(error => {
        console.error('Failed to place the order. Please try again later.', error);
        alert('Failed to place the order. Please try again later.');
    });
};

// Request permission and get the FCM token
requestPermission()
    .then(() => {
        return getToken(messaging, { vapidKey: 'BAtm0DTq2ZbmJwIUGhavPqHRzbk5gXInm5tbmDronAXW718au1VprOSERUI3UiXHBxTdWochKbcmOhmphmWD5Uc' });
    })
    .then(token => {
        console.log('FCM Token:', token);
        // Optionally, send this token to your server
    })
    .catch(error => {
        console.error('Error getting notification permission or token:', error);
    });
