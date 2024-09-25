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
            <p>${product.name} - ₱${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button> <!-- Using _id -->
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
}

// Function to remove items from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId); // Ensure you're filtering correctly
    updateCart();
}

// Function to update cart display
