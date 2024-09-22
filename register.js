document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const firstName = document.getElementById('firstName').value; // Get first name
    const lastName = document.getElementById('lastName').value;   // Get last name
    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;

    const errorDiv = document.getElementById('errorDiv');
    const successDiv = document.getElementById('successDiv');
    const loadingDiv = document.getElementById('loadingDiv'); // Loading indicator

    errorDiv.innerText = ''; // Clear previous errors
    successDiv.innerText = ''; // Clear previous success messages

    // Simple client-side validation
    if (!firstName || !lastName || !lrn || !password) {
        errorDiv.innerText = 'Please fill in all fields.';
        return;
    }

    try {
        // Disable the submit button to prevent multiple submissions
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;
        loadingDiv.style.display = 'block'; // Show loading indicator

        const response = await fetch('https://mshssm-canteen.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, lrn, password }), // Include firstName and lastName in the body
        });

        if (response.ok) {
            successDiv.innerText = 'Registration successful!';
            setTimeout(() => {
                window.location.href = 'website.html';
            }, 1000);
            // Reset form fields
            document.getElementById('registrationForm').reset();
        } else {
            const errorMessage = await response.text();
            errorDiv.innerText = errorMessage; // Display error message
        }
    } catch (error) {
        console.error('Error during registration:', error);
        errorDiv.innerText = 'Failed to register. Please try again.';
    } finally {
        // Re-enable the submit button and hide the loading indicator
        submitButton.disabled = false;
        loadingDiv.style.display = 'none'; // Hide loading indicator
    }
});
