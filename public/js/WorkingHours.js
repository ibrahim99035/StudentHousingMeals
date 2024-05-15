function isCurrentTimeBetween7AMAnd12PM() {
    // Get the current date and time
    const currentDate = new Date();

    // Extract the hours from the current date
    const hours = currentDate.getHours();

    // Check if the hours are between 7 and 12
    return hours >= 7 && hours < 12;
}

// Redirect function
function redirectToAnotherRoute() {
    // Redirect to another route if current time is not between 7AM and 12PM
    if (!isCurrentTimeBetween7AMAnd12PM()) {
        window.location.href = "/unavailable";
    }
}

// Call the redirect function when the document is loaded
document.addEventListener("DOMContentLoaded", redirectToAnotherRoute);
