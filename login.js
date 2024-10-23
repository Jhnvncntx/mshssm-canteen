document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('message').textContent = '';

    const userType = document.querySelector('input[name="userType"]:checked').value; // Get user type
    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;

    // Log the login attempt details
    console.log('Logging in:', { userType, lrn, password });

    try {
        const response = await fetch(`https://mshssm-canteen.onrender.com/api/login/${userType}`, { // Use user type in URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userType === 'customers' ? { lrn, password } : { mobileNumber: lrn, password }) // Adjust body based on user type
        });

        let result;
        try {
            result = await response.json(); // Parse JSON response
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('message').textContent = 'Error parsing response: ' + error.message; // Display parsing error
            return;
        }

        document.getElementById('loading').style.display = 'none'; // Hide loading indicator

        // Log the response
        console.log('Fetch result:', result);

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
            document.getElementById('message').textContent = 'Error: ' + result.error; // Display server error
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none'; // Hide loading indicator
        document.getElementById('message').textContent = 'Error: ' + error.message; // Display error message
    }
});
