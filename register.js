document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;

    const errorDiv = document.getElementById('errorDiv');
    const successDiv = document.getElementById('successDiv');
    const loadingDiv = document.getElementById('loadingDiv');
    const submitButton = document.getElementById('submitButton'); // Ensure this is defined here

    errorDiv.innerText = '';
    successDiv.innerText = '';

    // Simple client-side validation
    if (!firstName || !lastName || !lrn || !password) {
        errorDiv.innerText = 'Please fill in all fields.';
        return;
    }

    try {
        submitButton.disabled = true; // Disable the submit button
        loadingDiv.style.display = 'block'; // Show loading indicator

        const response = await fetch('https://mshssm-canteen.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, lrn, password }),
        });

        if (response.ok) {
            successDiv.innerText = 'Registration successful!';
            setTimeout(() => {
                window.location.href = 'website.html';
            }, 1000);
            document.getElementById('registrationForm').reset();
        } else {
            const errorMessage = await response.text();
            errorDiv.innerText = errorMessage;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        errorDiv.innerText = 'Failed to register. Please try again.';
    } finally {
        submitButton.disabled = false; // Re-enable the submit button
        loadingDiv.style.display = 'none'; // Hide loading indicator
    }
});
