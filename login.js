document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorDiv');

    errorDiv.innerText = ''; // Clear previous error messages

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lrn, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store JWT token in localStorage
            window.location.href = 'website.html'; // Redirect to the protected page
        } else {
            const errorMessage = await response.text();
            errorDiv.innerText = errorMessage; // Display error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorDiv.innerText = 'Failed to login. Please try again.';
    }
});