document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('SignInForm');

    signInForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = signInForm.elements['username'].value;
        const password = signInForm.elements['password'].value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful, do something with the response data
                console.log('Login successful:', data);

                // Store token and user model in local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to reservation page
                window.location.href = '/reservation';
            } else {
                // Login failed, handle the error
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});