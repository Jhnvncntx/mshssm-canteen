async function loadOrders() {
    const token = localStorage.getItem('token'); // Or however you're storing the JWT
    
    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const orders = await response.json();
        console.log('Fetched orders:', orders); // Debugging line

        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function displayOrders(orders) {
    const pendingContainer = document.getElementById('pendingOrders');
    const readyContainer = document.getElementById('readyOrders');
    const claimedContainer = document.getElementById('claimedOrders');

    // Clear the containers before displaying new orders
    pendingContainer.innerHTML = '';
    readyContainer.innerHTML = '';
    claimedContainer.innerHTML = '';

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'orders';
        orderElement.innerHTML = `
            <div class='orders-header'>
                <div class='orderId'>
                    Order: ${order.orderId}
                </div>
                <div class='customerName'>
                    Name: ${order.customerName}
                </div>
                <div class='totalAmount'>
                    Total: ₱${order.totalAmount}
                </div>
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
            itemDiv.addEventListener('click', event => {
                if (itemDiv.style.backgroundColor === 'lime') {
                    itemDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                    itemDiv.style.color = 'white'
                } else {
                itemDiv.style.backgroundColor = 'lime'
                itemDiv.style.color = 'black'                    
                }
            })
        });

        // Create "Ready" button
        if (order.status === 'Pending') {
            const readyButton = document.createElement('button');
            readyButton.className = 'button'
            readyButton.innerText = 'Ready';
            readyButton.addEventListener('click', () => {
                updateOrderStatus(order._id, 'Ready'); // Call the function to mark the order as Ready
            });
            orderElement.appendChild(readyButton);
        }

        // Create "Claimed" button for ready orders
        if (order.status === 'Ready') {
            const claimedButton = document.createElement('button');
            claimedButton.className = 'button'
            claimedButton.innerText = 'Claimed';
            claimedButton.addEventListener('click', () => {
                updateOrderStatus(order._id, 'Claimed'); // Call the function to mark the order as Claimed
            });
            orderElement.appendChild(claimedButton);
        }        

        // Create "Cancel" button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'button'
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', () => {
            updateOrderStatus(order._id, 'Canceled'); // Call the function to cancel the order
        });
        orderElement.appendChild(cancelButton);



        // Append orderElement to the appropriate container based on its status
        if (order.status === 'Pending') {
            pendingContainer.appendChild(orderElement);
        } else if (order.status === 'Ready') {
            readyContainer.appendChild(orderElement);
        } else if (order.status === 'Claimed') {
            claimedContainer.appendChild(orderElement);
        }
    });
}

async function updateOrderStatus(orderId, status) {
    try {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage
        const response = await fetch(`https://mshssm-canteen.onrender.com/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify({ status }) // Send the new status in the request body
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        // Reload orders after updating
        loadOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}

function welcomeUser() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const welcomeMessage = document.getElementById('welcomeMessage') 
    const fullName = firstName + ' ' + lastName

    welcomeMessage.textContent = `Hi ${fullName}!`
}

// Call loadOrders when the page loads
document.addEventListener('DOMContentLoaded', loadOrders);
document.addEventListener('DOMContentLoaded', welcomeUser);
