document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('message').textContent = '';

    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;
    document.getElementById('message').textContent = '';

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
            // Store the token (you can use localStorage, sessionStorage, or cookies)
            localStorage.setItem('token', result.token);
            // Optionally redirect to another page
            // window.location.href = 'homepage.html'; // Uncomment to redirect
        } else {
            document.getElementById('message').textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none'; // Hide loading indicator
        document.getElementById('message').textContent = 'Error: ' + error.message; // Display error message
    }
});
