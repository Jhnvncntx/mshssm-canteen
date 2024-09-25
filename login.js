document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('message').textContent = '';

    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lrn, password })
        });

        const result = await response.json();
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            console.log('Login successful:', result);
            document.getElementById('message').textContent = 'Login successful!';
            
            // Store the token and user information
            localStorage.setItem('token', result.token);
            localStorage.setItem('firstName', result.firstName); // Store first name
            localStorage.setItem('lastName', result.lastName);   // Store last name

            // Redirect to order page
            window.location.href = 'order.html';
        } else {
            document.getElementById('message').textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none'; // Hide loading indicator
        document.getElementById('message').textContent = 'Error: ' + error.message; // Display error message
    }
});
