document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorDiv');
    const successDiv = document.getElementById('successDiv');

    errorDiv.innerText = ''; // Clear previous errors
    successDiv.innerText = ''; // Clear previous success messages

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lrn, password }),
        });

        if (response.ok) {
            successDiv.innerText = 'Registration successful!';
            setTimeout(() => {
                window.location.href = 'website.html'}, 1000);
        } else {
            const errorMessage = await response.text();
            errorDiv.innerText = errorMessage; // Display error message
        }
    } catch (error) {
        console.error('Error during registration:', error);
        errorDiv.innerText = 'Failed to register. Please try again.';
    }
});
