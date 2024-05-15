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

    // Function to fetch meals for today for a specific user in the frontend
    async function fetchMealsForToday() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/meals/today/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch meals for today');
            }
            const mealsToday = await response.json();
            populateMealsForToday(mealsToday);
            return mealsToday;
        } catch (error) {
            console.error('Error fetching meals for today:', error.message);
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

    function generateQRCode(meal) {
        // Extract essential information from the meal object
        const { id, username, type, date } = meal;
        const Message = `${type} meal for student ${username} \nMeal ID: ${id} - Date: ${date}`;
        const qrText = Message;
    
        // Generate QR code
        const qrCodeDiv = document.createElement('div');
        new QRCode(qrCodeDiv, {
            text: qrText,
            width: 200,
            height: 200
        });
    
        // Create a link to download the QR code
        const dataUrl = qrCodeDiv.querySelector('canvas').toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'meal_qr_code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Function to populate meals for today in a separate table
    function populateMealsForToday(mealsToday) {
        const mealsTodayTableBody = document.querySelector('.meals-today-table tbody');

        mealsToday.forEach(meal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${meal.id}</td>
                <td>${meal.type}</td>
                <td>${meal.content}</td>
                <td><i class="far fa-qrcode qr-button" id="QRButton"></i></td>
            `;
            mealsTodayTableBody.appendChild(row);

            // Add event listener to the newly created QR icon
            const qrButton = row.querySelector('.qr-button');
            qrButton.addEventListener('click', () => generateQRCode(meal));
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
    fetchMealsForToday();
});
