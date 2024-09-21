const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html'; // Redirect to login
}

const cart = [];
const cartTable = document.getElementById('cartTable').getElementsByTagName('tbody')[0];
const totalPriceElement = document.getElementById('totalPrice');
const placeOrderBtn = document.getElementById('placeOrderBtn');

// Add to Cart functionality
const addToCart = (productName, productPrice) => {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCartDisplay();
};

// Update the cart display
const updateCartDisplay = () => {
    cartTable.innerHTML = ''; // Clear current cart
    let total = 0;

    cart.forEach(item => {
        const row = cartTable.insertRow();
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = item.price;
        row.insertCell(2).innerHTML = `<button class="removeBtn" data-name="${item.name}">Remove</button>`;
        total += item.price * item.quantity;
    });

    totalPriceElement.innerText = total;
    document.getElementById('emptyCartText').style.display = cart.length === 0 ? 'block' : 'none';
};

// Handle button clicks to add items to the cart
document.querySelectorAll('.orderBtns').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.parentElement.parentElement.getElementsByClassName('product-name')[0].innerText;
        const productPrice = parseInt(button.parentElement.parentElement.getElementsByClassName('price')[0].innerText);
        addToCart(productName, productPrice);
        document.getElementById('notification').style.display = 'block';
        setTimeout(() => document.getElementById('notification').style.display = 'none', 2000);
    });
});

// Handle order placement
placeOrderBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const order = {
        customerId: localStorage.getItem('customerId'), // Get the actual customer ID
        items: cart.map(item => ({ item: item.name, quantity: item.quantity })),
        status: 'pending'
    };

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include your JWT token
            },
            body: JSON.stringify(order),
        });

        // Check response status and handle errors
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            alert('Failed to place order. Please try again.');
            return;
        }

        const data = await response.json();
        alert(`Order placed successfully! Order ID: ${data.order.orderId}`);
        cart.length = 0; // Clear the cart
        updateCartDisplay(); // Update the display
    } catch (error) {
        console.error('Error:', error);
        alert('Error placing order. Please check the console for details.');
    }
});


// Remove item from cart functionality (optional)
cartTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('removeBtn')) {
        const productName = event.target.dataset.name;
        const index = cart.findIndex(item => item.name === productName);
        if (index > -1) {
            cart.splice(index, 1);
            updateCartDisplay();
        }
    }
});
