function isLoggedIn() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Check if both token and user exist in local storage
    if (token && user) {
        fetch('/test-token', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (response.ok) {
                return true; // Token is valid
            } else {
                return false; // Token is invalid
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // Error occurred, token is invalid
        });
    } else {
        return false;
    }
}

function isPast5PM() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Check if current hour is 17 (5 PM) or greater
    if (currentHour > 17 || (currentHour === 17 && currentMinute > 0)) {
        return true; // It's past 5 PM
    } else {
        return false; // It's not past 5 PM
    }
}

module.exports = {isLoggedIn, isPast5PM};