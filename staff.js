// staff.js

// Function to fetch orders
async function fetchOrders() {
    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're storing the JWT in localStorage
            }
        });
        const orders = await response.json();
        
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to display orders on the page
function displayOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; // Clear any existing content

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order';
        
        orderElement.innerHTML = `
            <p>Order ID: ${order._id}</p>
            <p>Customer: ${order.customerName}</p>
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
            <p>Status: ${order.status}</p>
            <p>Order Date: ${new Date(order.orderDate).toLocaleString()}</p>
            <button onclick="updateOrderStatus('${order._id}', 'Completed')">Complete Order</button>
            <button onclick="updateOrderStatus('${order._id}', 'Cancelled')">Cancel Order</button>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

// Call fetchOrders when the page loads
window.onload = fetchOrders;

// Update the function to delete the order if it's marked as completed
async function updateOrderStatus(orderId, newStatus) {
    try {
        if (newStatus === 'Completed') {
            const response = await fetch(`https://mshssm-canteen.onrender.com/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT for authentication
                }
            });

            if (response.ok) {
                alert('Order completed and removed successfully!');
                fetchOrders(); // Refresh the list of orders
            } else {
                alert('Failed to complete and remove order');
            }
        } else {
            // If it's cancelled, you might want to just update the status
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT for authentication
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert('Order status updated successfully!');
                fetchOrders(); // Refresh the list of orders
            } else {
                alert('Failed to update order status');
            }
        }
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}

