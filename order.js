// Sample Products Data (can later be fetched from your database)
const products = [
    { id: 1, name: 'Buko Juice', price: 15 },
    { id: 2, name: 'Burger', price: 25 },
    { id: 3, name: 'Cup Noodles', price: 25 },
    { id: 4, name: 'Lugaw', price: 15},
    { id: 5, name: 'Siomai', price: 25},
    { id: 6, name: 'Siomai Rice', price: 35},
    { id: 7, name: 'Pillows', price: 10},
    { id: 8, name: 'Piattos', price: 20},
    { id: 9, name: 'Tattos', price: 10}
    // Add more products as needed
];

let cart = [];

// Function to display products
function displayProducts() {
    const productsList = document.getElementById('products-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <p>${product.name} - ₱${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsList.appendChild(productDiv);
    });
}

// Function to add items to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Function to remove items from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
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
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
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
        alert("Your cart is empty!");
    }
});

// Function to send order to the server
function placeOrder() {
    // Retrieve user's name and token from localStorage
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const token = localStorage.getItem('token');

    // Create the customer name from first and last name
    const customerName = `${firstName} ${lastName}`;

    fetch('https://mshssm-canteen.onrender.com/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add the token in the headers
        },
        body: JSON.stringify({
            customerName, // Include customer name
            items: cart.map(item => ({
                productId: item.id, // Assuming the product ID is the same as the item ID
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })), // Include cart items
            totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0) // Calculate total amount
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Order placed successfully!');
        cart = []; // Clear the cart
        updateCart(); // Update the cart display
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    });
}

// Initialize
displayProducts();
