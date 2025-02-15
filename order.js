// Function to check if token is expired
function isTokenExpired(token) {
    if (!token) return true; // If no token, consider it expired

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
    const exp = payload.exp * 1000; // Convert expiration time to milliseconds
    return Date.now() >= exp; // Check if current time is greater than expiration time
}

// Function to fetch products from the server
function fetchProducts() {
    fetch('https://mshssm-canteen.onrender.com/api/products') // Adjust this URL if necessary
        .then(response => response.json())
        .then(data => {
            // Assuming the response is an array of products
            products = data; // Update the products variable with fetched data
            displayProducts(); // Call the display function to show products on the page
        })
        .catch(error => {
            console.error('Error fetching products:', error);
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
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <div class='pname'>${product.name}</div> <div class='pprice'>₱${product.price}</div>
            <div class='pstock'>stock ${product.stock}</div>
            <div class='pbutton'><button onclick="addToCart('${product._id}')">Add to Cart</button></div> <!-- Using _id -->
        `;
        productsList.appendChild(productDiv);
    });
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
    showToast('Added to Cart', type = 'addToCart');
}
// ############################################################################
function showToast(message, type, duration = 800) {
    const container = document.getElementById("toast-container");
  
    // Create the toast element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
  
    // Append the toast to the container
    container.appendChild(toast);
  
    // Remove the toast after the specified duration
    setTimeout(() => {
      toast.style.animation = "fade-out 0.5s ease";
      toast.addEventListener("animationend", () => toast.remove());
    }, duration);
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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₱${item.price}</td>
            <td>${item.quantity}</td>
            <td><button onclick="removeFromCart('${item.productId}')">Remove</button></td> <!-- Use productId -->
        `;
        cartItems.appendChild(row);
    });

    totalAmount.innerText = `₱${total.toFixed(2)}`;
}

// Function to handle order placement
document.getElementById('place-order').addEventListener('click', () => {
    if (cart.length > 0) {
        placeOrder();
    } else {
        showToast('Your Cart is Empty!', type = 'emptyCart');
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

    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    const customerName = `${firstName} ${lastName}`;

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
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert(`Order placed successfully! Your order ID is: ${data.order.orderId}`);
        cart = [];
        updateCart();
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    });
}

// Initialize
