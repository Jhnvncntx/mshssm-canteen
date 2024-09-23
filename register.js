document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('message').textContent = '';

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const lrn = document.getElementById('lrn').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mshssm-canteen.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, lrn, password })
        });

        const result = await response.text();
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            document.getElementById('registerForm').reset();
            document.getElementById('message').textContent = 'Registration successful!';
        } else {
            document.getElementById('message').textContent = 'Error: ' + result;
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('message').textContent = 'Error: ' + error.message;
    }
});
