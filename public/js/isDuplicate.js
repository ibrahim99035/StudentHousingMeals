function fetchAndCheckMeals(userId, mealType) {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

    return fetch(`/meals/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(meals => {
            // Check if there's any meal with the same type on the same day
            const duplicateMeal = meals.find(meal => meal.type === mealType && meal.date.slice(0, 10) === currentDate);
            return duplicateMeal; // Return true if duplicate meal found, false otherwise
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
            return false; // Return false in case of an error
        });
}