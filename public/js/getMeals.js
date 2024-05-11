// JavaScript code to fetch meals with user information and populate the table
function fetchAndDisplayMeals() {
    fetch('/meals')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(meals => {
            const tableBody = document.querySelector('#mealTable tbody');

            meals.forEach(meal => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${meal.id}</td>
                    <td>${meal.username}</td>
                    <td>${meal.email}</td>
                    <td>${meal.role}</td>
                    <td>${meal.type}</td>
                    <td>${meal.content}</td>
                    <td>${new Date(parseFloat(meal.date)).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
        });
}

// Call the function to fetch and display meals
fetchAndDisplayMeals();
