document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

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

        if (response.ok) {
            // Store the token (you can use localStorage, sessionStorage, or cookies)
            localStorage.setItem('token', result.token);
            document.getElementById('message').textContent = 'Login successful!';
            // Optionally redirect to another page
            // window.location.href = 'homepage.html'; // Uncomment to redirect
        } else {
            document.getElementById('message').textContent = 'Error: ' + result;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error: ' + error.message;
    }
});
