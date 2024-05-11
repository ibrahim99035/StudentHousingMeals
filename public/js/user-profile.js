document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;

    // Function to fetch meals for a specific user in the frontend
    async function fetchMealsByUserId() {
        try {
            const response = await fetch(`/meals/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch meals');
            }
            const meals = await response.json();
            populateMealsData(meals);
            return meals;
        } catch (error) {
            console.error('Error fetching meals:', error.message);
            throw error;
        }
    }

    // Function to populate meals data in the meals table
    function populateMealsData(mealsData) {
        // Sort mealsData array by date in descending order
        mealsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        const mealsTableBody = document.querySelector('.meals-table tbody');

        mealsData.forEach(meal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${meal.id}</td>
                <td>${meal.type}</td>
                <td>${meal.content}</td>
                <td>${new Date(parseFloat(meal.date)).toLocaleString()}</td>
            `;
            mealsTableBody.appendChild(row);
        });
    }

    // Function to populate user data in the user profile section
    function populateUserData() {
        const userNameSpan = document.getElementById('user-name');
        const userEmailSpan = document.getElementById('user-email');
        const userRoleSpan = document.getElementById('user-role');

        userNameSpan.textContent = user.username;
        userEmailSpan.textContent = user.email;
        userRoleSpan.textContent = user.role;
    }

    // Call functions to populate user data and fetch meals data
    populateUserData();
    fetchMealsByUserId();
});
