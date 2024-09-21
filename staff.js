const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
const loadingIndicator = document.getElementById('loadingIndicator'); // Add this at the top of staff.js

const fetchOrders = async () => {
    loadingIndicator.style.display = 'block'; // Show loading
    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/orders'); // Update with your API
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();
        populateOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        showError('Failed to fetch orders. Please try again.'); // Call showError on failure
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading
    }
};

const showError = (message) => {
    const errorDiv = document.getElementById('errorDiv'); // Create a div for error messages
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
};

const populateOrders = (orders) => {
    ordersTable.innerHTML = ''; // Clear the table
    orders.forEach(order => {
        const row = ordersTable.insertRow();
        row.insertCell(0).innerText = order._id; // Order ID
        row.insertCell(1).innerText = order.customerId; // Customer ID
        row.insertCell(2).innerText = order.items.map(item => `${item.item} (x${item.quantity})`).join(', '); // Items
        row.insertCell(3).innerText = order.status; // Status

        const actionCell = row.insertCell(4);
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Complete';
        completeButton.onclick = async () => {
            const confirmed = confirm('Are you sure you want to mark this order as complete?');
            if (confirmed) {
                await updateOrderStatus(order._id, 'completed');
            }
        };
        actionCell.appendChild(completeButton);
    });
};

const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(`https://mshssm-canteen.onrender.com/api/orders/${orderId}`, {
            method: 'PATCH', // Use PATCH to update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        fetchOrders(); // Refresh the orders after update
    } catch (error) {
        console.error('Error updating order status:', error);
    }
};

// Call fetchOrders on page load
window.onload = fetchOrders;
