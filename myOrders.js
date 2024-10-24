document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('pending-list');
    const readyContainer = document.getElementById('ready-list');
    const claimedContainer = document.getElementById('claimed-list');

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/orders/my-orders', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Ensure you set your token properly
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();

        // Check if there are orders and categorize them
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No pending orders.</p>';
            readyContainer.innerHTML = '<p>No ready orders.</p>';
            claimedContainer.innerHTML = '<p>No claimed orders.</p>';
        } else {
            orders.forEach(order => {

                // Add the Cancel button for pending orders
                let cancelButton = '';
                if (order.status === 'Pending') {
                    cancelButton = `<button class="cancel-button" data-order-id="${order.orderId}">Cancel Order</button>`;
                }

                const orderElement = document.createElement('div');
                orderElement.className = 'orders'
                orderElement.innerHTML = `
                    <div class='orders-header'>
                        <div class='orderId'><h3>Order ID: ${order.orderId}</h3></div>
                        <div class= 'totalAmount'><p>Total Amount: ₱${order.totalAmount}</p></div>
                        <div class='orderStatus'><p>Status: ${order.status}</p></div>
                        <div class='itemList'></div>
                        ${cancelButton}
                    </div>
                `;

                order.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'itemDiv'
                    itemDiv.innerHTML = `
                    <div class='item-quantity'>${item.quantity}</div>
                    <div class='item-name'>${item.name}</div>
                    `;
                    orderElement.appendChild(itemDiv);
                });

                // Categorize based on status
                switch (order.status) {
                    case 'Pending':
                        ordersContainer.appendChild(orderElement);
                        break;
                    case 'Ready':
                        readyContainer.appendChild(orderElement);
                        break;
                    case 'Claimed':
                        claimedContainer.appendChild(orderElement);
                        break;
                }
            });
        }

        // Add Event Listener for Cancel Buttons
        const cancelButtons = document.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.getAttribute('data-order-id');
                try {
                    const response = await fetch(`https://mshssm-canteen.onrender.com/api/orders/cancel/${orderId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token') // Ensure you set your token properly
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to cancel order');
                    }

                    const result = await response.json();
                    alert(result.message); // Show success message

                    // Optionally, you can refresh the orders or update the UI accordingly
                    location.reload(); // Refresh the page to reflect changes
                } catch (error) {
                    console.error('Error cancelling order:', error);
                    alert('Error cancelling order. Please try again.');
                }
            });
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = '<p>Error fetching orders.</p>';
    }
});
