document.addEventListener('DOMContentLoaded', function() {
    // Fetch products and display them when the page loads
    fetchProducts();

    // Handle stock update on the form
    document.getElementById('update-stock-form').addEventListener('submit', updateStock);
});

// Fetch all products from the server
function fetchProducts() {
    fetch('https://mshssm-canteen.onrender.com/api/products', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('staffToken')}`, // Add staff token to header
        }
    })
    .then(response => response.json())
    .then(data => {
        displayProducts(data);
    })
    .catch(error => console.error('Error fetching products:', error));
}

// Display products in the HTML
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">₱${product.price}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
            <button onclick="editStock('${product._id}')">Edit Stock</button>
            <button onclick="deleteProduct('${product._id}')">Delete Product</button>
        `;
        productsList.appendChild(productDiv);
    });
}

// Edit stock for a product (update quantity)
function editStock(productId) {
    const newStock = prompt('Enter new stock quantity:');
    if (newStock && !isNaN(newStock)) {
        updateStockInDb(productId, parseInt(newStock));
    } else {
        alert('Invalid stock quantity');
    }
}

// Update stock in the database
function updateStockInDb(productId, newStock) {
    fetch(`https://mshssm-canteen.onrender.com/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('staffToken')}`,
        },
        body: JSON.stringify({ stock: newStock })
    })
    .then(response => response.json())
    .then(data => {
        alert('Stock updated successfully!');
        fetchProducts(); // Refresh the product list
    })
    .catch(error => console.error('Error updating stock:', error));
}

// Delete a product from the stock
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`https://mshssm-canteen.onrender.com/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('staffToken')}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Product deleted successfully!');
            fetchProducts(); // Refresh the product list
        })
        .catch(error => console.error('Error deleting product:', error));
    }
}

// Add a new product to the stock
function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;

    if (name && price && stock) {
        const newProduct = {
            name: name,
            price: parseFloat(price),
            stock: parseInt(stock)
        };

        fetch('https://mshssm-canteen.onrender.com/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('staffToken')}`,
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            alert('New product added successfully!');
            fetchProducts(); // Refresh the product list
        })
        .catch(error => console.error('Error adding product:', error));
    } else {
        alert('Please fill in all fields');
    }
}