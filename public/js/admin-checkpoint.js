function isAdmin() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    

    // Check if both token and user exist in local storage
    if (token && user) {
        return fetch('/test-token', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (!response.ok) {
                return false; // Token is valid
            }
            if(user.role !== 'Admin'){
                return false;
            } else{
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // Error occurred, token is invalid
        });
    } else {
        return Promise.resolve(false); // Return a resolved Promise indicating not logged in
    }
}

window.onload = function() {
    isAdmin().then(loggedIn => {
        if (!loggedIn) {
            // Redirect the user to the login page
            window.location.href = '/';
        }
    }).catch(error => {
        console.error('Error checking login status:', error);
    });
};