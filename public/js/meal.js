// Function to extract meal information from the form
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
console.log(user);
function extractMealInfo() {
    let lunch_content = '';
    // Initialize an object to store meal information
    var mealInfo = {
        breakfast: false,
        lunch: {
            flag: false,
            starches: {
                flag: false,
                item: ""
            },
            protein: {
                flag: false,
                item: ""
            },
            "legumes&starches": {
                flag: false,
                item: ""
            },
            fruit: false,
            salad: false
        },
        dinner: false
    };

    // Check if breakfast is selected
    mealInfo.breakfast = document.getElementById("meal9").checked;

    if(mealInfo.breakfast){
        let mealData = {
            userID: user.id,
            type: 'breakfast',
            date: Date.now()
        }
        serverCall(mealData); 
    }

    // Check if lunch is selected
    mealInfo.lunch.flag = document.getElementById("meal1").checked || document.getElementById("meal2").checked || document.getElementById("meal3").checked || document.getElementById("meal4").checked || document.getElementById("meal5").checked;

    // Check if starches option is selected for lunch
    lunch_content = '';
    if (mealInfo.lunch.flag) {
        mealInfo.lunch.starches.flag = document.getElementById("meal1").checked;
        if (mealInfo.lunch.starches.flag) {
            mealInfo.lunch.starches.item = document.querySelector('input[name="meal1"]:checked').value;
            lunch_content += `(${mealInfo.lunch.starches.item})`
        }

        // Check if protein option is selected for lunch
        mealInfo.lunch.protein.flag = document.getElementById("meal2").checked;
        if (mealInfo.lunch.protein.flag) {
            mealInfo.lunch.protein.item = document.querySelector('input[name="meal2"]:checked').value;
            lunch_content += `(${mealInfo.lunch.protein.item})`
        }

        // Check if legumes&starches option is selected for lunch
        mealInfo.lunch["legumes&starches"].flag = document.getElementById("meal3").checked;
        if (mealInfo.lunch["legumes&starches"].flag) {
            mealInfo.lunch["legumes&starches"].item = document.querySelector('input[name="meal3"]:checked').value;
            lunch_content += `(${mealInfo.lunch["legumes&starches"].item})`
        }

        mealInfo.lunch.fruit = document.getElementById("meal4").checked;
        if (mealInfo.lunch.fruit) {
            lunch_content += `(Fruits)`
        }

        mealInfo.lunch.salad = document.getElementById("meal5").checked;
        if (mealInfo.lunch.salad) {
            lunch_content += `(Green Salads)`
        }

        let mealData = {
            userID: user.id,
            type: 'lunch',
            content: lunch_content,
            date: Date.now()
        }
        console.log('Lunch content:', lunch_content);

        serverCall(mealData); 
    }

    

    // Check if dinner is selected
    mealInfo.dinner = document.getElementById("meal6").checked;

    if(mealInfo.dinner){
        let mealData = {
            userID: user.id,
            type: 'dinner',
            date: Date.now()
        }
        
        serverCall(mealData);
        
    }
    window.location.href = '/profile';
    return mealInfo;
}


// Function to handle form submission
function handleFormSubmission(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    extractMealInfo();
    
}

function serverCall(mealData){
    const requestBody = {
        userID: mealData.userID,
        type: mealData.type,
        content: mealData.content || 'default', 
        date: mealData.date
    };

    // Make the fetch POST request
    fetch('/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response data if needed
        console.log('Meal added successfully:', data);
    })
    .catch(error => {
        console.error('Error adding meal:', error);
        alert('You cannot add same meal twice for one day!!')
    });
}

// Add event listener to the form submission
document.querySelector("form").addEventListener("submit", handleFormSubmission);