document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('orders-list');

    // Function to fetch customer's orders
    const fetchOrders = async () => {
        try {
            const response = await fetch('https://mshssm-canteen.onrender.com/orders/my-orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            ordersList.innerHTML = '<p>Error loading orders. Please try again later.</p>';
        }
    };

    // Function to display orders in the DOM
    const displayOrders = (orders) => {
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>No orders found.</p>';
            return;
        }

        ordersList.innerHTML = ''; // Clear the list first

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <h3>Order ID: ${order.orderId}</h3>
                <p>Customer Name: ${order.customerName}</p>
                <p>Total Amount: $${order.totalAmount}</p>
                <p>Status: ${order.status}</p>
                <button class="cancel-btn" data-id="${order._id}">Cancel Order</button>
            `;
            ordersList.appendChild(orderDiv);
        });

        // Attach event listeners for cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', cancelOrder);
        });
    };

    // Function to cancel an order
    const cancelOrder = async (e) => {
        const orderId = e.target.getAttribute('data-id');

        try {
            const response = await fetch(`https://mshssm-canteen.onrender.com/orders/cancel/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            alert('Order canceled successfully');
            fetchOrders(); // Refresh the orders list
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order. Please try again later.');
        }
    };

    // Fetch orders on page load
    fetchOrders();
});