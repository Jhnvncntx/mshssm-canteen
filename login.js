// Customer Login
document.getElementById('customerLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show the loading display
    const loadingDisplay = document.getElementById("loading");
    loadingDisplay.classList.remove("hidden");    

    const lrn = document.getElementById('customerLRN').value.trim();
    const password = document.getElementById('customerPassword').value.trim();
    const messageDiv = document.getElementById('customerMessage');

    // Clear previous messages
    messageDiv.textContent = '';

    // Simple validation
    if (!lrn || !password) {
        messageDiv.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lrn, password })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Customer Login successful:', result);
            
            // Store token and user info
            localStorage.setItem('token', result.token);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);

            // Redirect to order page
            window.location.href = 'order.html';
        } else {
            messageDiv.textContent = 'Error: ' + result.error;
            loadingDisplay.classList.add("hidden");
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again later.';
    }
});

// Staff Login
document.getElementById('staffLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show the loading display
    const loadingDisplay = document.getElementById("loading");
    loadingDisplay.classList.remove("hidden");      

    const mobileNumber = document.getElementById('staffMobileNumber').value.trim();
    const password = document.getElementById('staffPassword').value.trim();
    const messageDiv = document.getElementById('staffMessage');

    // Clear previous messages
    messageDiv.textContent = '';

    // Simple validation
    if (!mobileNumber || !password) {
        messageDiv.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber, password })
        });

        const result = await response.json();

        if (response.ok) {
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
            loadingDisplay.classList.add("hidden");
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again later.';
    }
});
