document.addEventListener('DOMContentLoaded', function() {
    // Fetch products and display them when the page loads
    fetchProducts();
    welcomeUser();
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
        productDiv.className = 'product';
        productDiv.innerHTML = `
        <div class='infos'>
            <div class='pname'>${product.name}</div> <div class='pprice'>₱${product.price}</div> <div class="pstock">Stock: ${product.stock}</div>
        </div>

        <div class='buttons'>
            <div class='pbutton'><button onclick="editStock('${product._id}')">Edit Stock</button></div>
            <div class='pbutton'><button onclick="deleteProduct('${product._id}')">Delete Product</button></div>
        </div>
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
document.getElementById('add-product-form').addEventListener('submit', async function(event) {
    event.preventDefault();

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
});

function welcomeUser() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const welcomeMessage = document.getElementById('welcomeMessage') 
    const fullName = firstName + ' ' + lastName

    welcomeMessage.textContent = `Hi ${fullName}!`
}
