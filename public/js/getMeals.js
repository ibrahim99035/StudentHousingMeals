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
                    <td class="icon-rows">${meal.pending ? '<i class="fas fa-check true-icon pending-icon"></i>' : '<i class="fas fa-times false-icon pending-icon"></i>'}</td>
                    <td class="icon-rows">${meal.prepared ? '<i class="fas fa-check true-icon prepared-icon"></i>' : '<i class="fas fa-times false-icon prepared-icon"></i>'}</td>
                    <td class="icon-rows">${meal.expired ? '<i class="fas fa-check true-icon expired-icon"></i>' : '<i class="fas fa-times false-icon expired-icon"></i>'}</td>
                    <td class="icon-rows">${meal.reserved ? '<i class="fas fa-check true-icon reserved-icon"></i>' : '<i class="fas fa-times false-icon reserved-icon"></i>'}</td>
                    <td class="icon-rows"><i class="far fa-qrcode qr-button"></i></td>
                    <td class="icon-rows"><i class="fas fa-trash delete-icon"></i></td>
                `;
                const deleteIcon = row.querySelector('.delete-icon');
                deleteIcon.addEventListener('click', () => {
                    DeleteModal(meal, 'Deleting');
                });

                const pendingIcon = row.querySelector('.pending-icon');
                pendingIcon.addEventListener('click', () => {
                    openModal(meal, 'Switch Pending Flag', 'pending', meal.pending);
                });
                
                const preparedIcon = row.querySelector('.prepared-icon');
                preparedIcon.addEventListener('click', () => {
                    openModal(meal, 'Marking as Prpared', 'prepared', meal.prepared);
                });

                const expiredIcon = row.querySelector('.expired-icon');
                expiredIcon.addEventListener('click', () => {
                    openModal(meal, 'Marking as Expired', 'expired', meal.expired);
                });

                const reservedIcon = row.querySelector('.reserved-icon');
                reservedIcon.addEventListener('click', () => {
                    openModal(meal, 'Marking as Reserved', 'reserved', meal.reserved);
                });
                const QrIcon = row.querySelector('.qr-button');
                QrIcon.addEventListener('click', () => {
                    QrCodeModal(meal);
                });
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
        });
}

async function updateMealStatus(route, id, status) {
    try {
        const toggledStatus = !status;

        const response = await fetch(`/meals/${id}/${route}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [route]: toggledStatus })
        });

        const data = await response.json();
        const row = document.createElement('tr');
        row.innerHTML = ``
        window.location.reload(true);
        return data;
    } catch (error) {
        console.error(`Error updating ${route} status:`, error);
        throw error;
    }
}

async function deleteMeal(id) {
    try {
        const response = await fetch(`/meals/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        window.location.reload(true);
        return data;
    } catch (error) {
        console.error('Error deleting meal:', error);
        throw error;
    }
}

function generateQRCode(meal, modalContent) {
    // Extract essential information from the meal object
    const { id, username, type, date } = meal;
    const Message = `${type} meal for student ${username} \nMeal ID: ${id} - Date: ${date}`
    const qrText = Message

    // Create a div element to hold the QR code
    const qrCodeDiv = document.createElement('div');
    qrCodeDiv.classList.add('qr-code-container');

    // Create QR code using QRCode.js
    new QRCode(qrCodeDiv, {
        text: qrText,
        width: 256,
        height: 256
    });

    // Append QR code div to the modal content
    const QR_Header = document.createElement('h2');
    QR_Header.innerText = `QR Code of the ${type} meal with id: ${id} for ${username}.`
    modalContent.appendChild(QR_Header);
    modalContent.appendChild(qrCodeDiv);

    // Add a button in the modal content to download the QR code
    const downloadButton = document.createElement('li');
    downloadButton.classList.add("fa-solid");
    downloadButton.classList.add("fa-download");
    downloadButton.classList.add("downloadIcon");
    downloadButton.addEventListener('click', () => {
        const canvas = qrCodeDiv.querySelector('canvas');
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'meal_qr_code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    modalContent.appendChild(downloadButton);
}

function openModal(meal, action, route, status) {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");

    // Clear previous content
    modalContent.innerHTML = '';

    // Populate modal with meal information
    modalContent.innerHTML = `
        <h1>Meal: ${meal.id} - Flag ${route} status toggle!</h1>
        <p>
            You are ${action} the ${meal.type} meal for the ${meal.role} named ${meal.username} 
            for ${new Date(parseFloat(meal.date)).toLocaleString()}
        </p>
        <h3>Current Status: ${status ? 'true' : 'false'}</h3>
        <h4>You Can Toggle From The Switch Bellow:</h4>
        ${status ?
            
            '<i class="fa-solid fa-toggle-on" id="toggleStatus"></i>' :
            '<i class="fa-solid fa-toggle-off" id="toggleStatus"></i>'
        }
    `;

    // Attach event listener after adding content to the DOM
    const toggleStatus = document.getElementById("toggleStatus");
    toggleStatus.addEventListener('click', () => {
        updateMealStatus(route, meal.id, status);
    });

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    document.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function DeleteModal(meal, action) {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");

    // Clear previous content
    modalContent.innerHTML = '';

    // Populate modal with meal information
    modalContent.innerHTML = `
        <h1>Deleting ${meal.type} meal with ID: ${meal.id} for ${meal.username}.</h1>
        <p>
            You are ${action} the ${meal.type} meal for the ${meal.role} named ${meal.username} 
            for ${new Date(parseFloat(meal.date)).toLocaleString()}
        </p>
        <h3>You Can delete the meal from here.</h3>
        <div id="deleteButton">
            <i class="fas fa-trash delete-icon"></i>
        </div>
    `;

    const DeletingIcon = document.getElementById("deleteButton");
    DeletingIcon.addEventListener('click', () => {
        deleteMeal(meal.id);
    });


    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function QrCodeModal(meal) {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");

    // Clear previous content
    modalContent.innerHTML = '';
    generateQRCode(meal, modalContent);

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
// Call the function to fetch and display meals
fetchAndDisplayMeals();