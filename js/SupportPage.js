document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("support-form");
    
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const firstName = form.querySelector("input[placeholder='First Name']").value;
        const lastName = form.querySelector("input[placeholder='Last Name']").value;
        const email = form.querySelector("input[placeholder='Email']").value;
        const purpose = form.querySelector("select").value;
        const comment = form.querySelector("textarea").value;

        // Create data object to send
        const formData = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            purpose: purpose,
            comment: comment
        };

        // API endpoint and key
        const API_URL = " https://assg2fed-9901.restdb.io/rest/supportfeedback";
        const API_KEY = "6796f5fcf9d2bbcd3d181e27";

        // Send data using Fetch API
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Your feedback has been submitted successfully!");
            form.reset(); // Clear form fields after successful submission
            if (form.querySelector("select").value == 'Feedback'){
                window.location.href = "GamePage.html";
            }
        })
        .catch(error => {
            console.error("Error submitting the form:", error);
            alert("There was an error submitting your feedback. Please try again later.");
        });
    });
});