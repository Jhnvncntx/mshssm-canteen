// Customer Login
document.getElementById('customerLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const lrn = document.getElementById('customerLRN').value;
    const password = document.getElementById('customerPassword').value;

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lrn, password })
        });

        const result = await response.json();
        const messageDiv = document.getElementById('customerMessage');

        if (response.ok) {
            // Handle successful login (store token, redirect, etc.)
            console.log('Customer Login successful:', result);
            messageDiv.textContent = 'Login successful!';
            
            // Store token and user info
            localStorage.setItem('token', result.token);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);

            // Redirect to order page
            window.location.href = 'order.html';
        } else {
            messageDiv.textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Staff Login
document.getElementById('staffLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const mobileNumber = document.getElementById('staffMobileNumber').value;
    const password = document.getElementById('staffPassword').value;

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber, password })
        });

        const result = await response.json();
        const messageDiv = document.getElementById('staffMessage');

        if (response.ok) {
            // Handle successful login (store token, redirect, etc.)
            console.log('Staff Login successful:', result);
            messageDiv.textContent = 'Login successful!';
            
            // Store token and user info
            localStorage.setItem('token', result.token);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);

            // Redirect to staff page
            window.location.href = 'staff.html';
        } else {
            messageDiv.textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
