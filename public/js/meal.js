// Function to extract meal information from the form
function extractMealInfo() {
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
            }
        },
        dinner: false
    };

    // Check if breakfast is selected
    mealInfo.breakfast = document.getElementById("meal5").checked;

    // Check if lunch is selected
    mealInfo.lunch.flag = mealInfo.breakfast || document.getElementById("meal1").checked || document.getElementById("meal2").checked || document.getElementById("meal3").checked || document.getElementById("meal4").checked;

    // Check if starches option is selected for lunch
    if (mealInfo.lunch.flag) {
        mealInfo.lunch.starches.flag = document.getElementById("meal1").checked;
        if (mealInfo.lunch.starches.flag) {
            mealInfo.lunch.starches.item = document.querySelector('input[name="meal1"]:checked').value;
        }

        // Check if protein option is selected for lunch
        mealInfo.lunch.protein.flag = document.getElementById("meal2").checked;
        if (mealInfo.lunch.protein.flag) {
            mealInfo.lunch.protein.item = document.querySelector('input[name="meal2"]:checked').value;
        }

        // Check if legumes&starches option is selected for lunch
        mealInfo.lunch["legumes&starches"].flag = document.getElementById("meal3").checked;
        if (mealInfo.lunch["legumes&starches"].flag) {
            mealInfo.lunch["legumes&starches"].item = document.querySelector('input[name="meal3"]:checked').value;
        }
    }

    // Check if dinner is selected
    mealInfo.dinner = document.getElementById("meal6").checked;

    // Return the extracted meal information
    console.log(mealInfo);
    serverCall(mealInfo);
    return mealInfo;
}


// Function to handle form submission
function handleFormSubmission(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Extract meal information
    var mealInformation = extractMealInfo();

    // Output the extracted meal information
    console.log(JSON.stringify(mealInformation, null, 4));

    // You can optionally perform other actions here, such as sending the data to a server via AJAX
}

function serverCall(mealInformation){
    const formData = new FormData();

    formData.append()
}

// Add event listener to the form submission
document.querySelector("form").addEventListener("submit", handleFormSubmission);
