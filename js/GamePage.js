// Initialize user points
let userPoints = 0;
document.getElementById("points").innerText = userPoints;
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


const APIKEY = "6796f5fcf9d2bbcd3d181e27";
const API_URL = `https://assg2fed-9901.restdb.io/rest/accounts`;

// Fetch logged-in user data from RestDB
async function fetchUserData() {
    try {
        let response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        let users = await response.json();

        // Find user based on email (ensure this matches RestDB data)
        let user = users.find(u => u.email === loggedInUser.email);
        if (user) {
            loggedInUser = user;
            userPoints = user.points || 0;
            document.getElementById("points").innerText = userPoints;

            // Set profile picture correctly
            const avatarElement = document.getElementById("avatar");
            avatarElement.src = loggedInUser.profilepic ? loggedInUser.profilepic : "default-avatar.png";
        } else {
            console.warn("User not found in database.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Call this function when the page loads
fetchUserData();

// Function to update user points in RestDB
async function updateUserPoints(newPoints) {
    if (!loggedInUser || !loggedInUser._id) {
        console.error("User ID not found, cannot update points.");
        return;
    }

    if (typeof newPoints !== "number" || isNaN(newPoints)) {
        console.error("Invalid points value:", newPoints);
        return;
    }

    const userID = loggedInUser._id;
    const updateURL = `${API_URL}/${userID}`;

    console.log("Sending update request:", updateURL, { points: newPoints });

    try {
        let response = await fetch(updateURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
            body: JSON.stringify({
                name: loggedInUser.name, // Required field
                password: loggedInUser.password, // Required field
                email: loggedInUser.email, // Required field
                profilepic: loggedInUser.profilepic || "", // Ensure profilepic is included
                number: loggedInUser.number || 0, // Ensure correct format
                firstname: loggedInUser.firstname || "",
                lastname: loggedInUser.lastname || "",
                bio: loggedInUser.bio || "",
                reviews: loggedInUser.reviews || 0,
                points: Number(newPoints), // Ensure `points` is sent as a number
            }),
        });

        let responseData = await response.json();
        console.log("Update Response:", responseData);

        if (!response.ok) throw new Error(responseData.message || "Failed to update points");

    } catch (error) {
        console.error("Error updating points:", error);
    }
}

// Define possible rewards based on color segments (60-degree intervals)
const rewards = {
    "yellow": 10,   // 0° - 60°
    "orange": 5,    // 60° - 120°
    "pink": 15,     // 120° - 180°
    "blue": 20,     // 180° - 240°
    "green": 50,    // 240° - 300°
    "purple": 25    // 300° - 360°
};

// Function to determine reward based on angle
function getReward(deg) {
    let normalizedDeg = 360 - deg; // Get the angle within 0-360°

    if (normalizedDeg >= 0 && normalizedDeg < 60) return rewards["yellow"];
    if (normalizedDeg >= 60 && normalizedDeg < 120) return rewards["orange"];
    if (normalizedDeg >= 120 && normalizedDeg < 180) return rewards["pink"];
    if (normalizedDeg >= 180 && normalizedDeg < 240) return rewards["blue"];
    if (normalizedDeg >= 240 && normalizedDeg < 300) return rewards["green"];
    if (normalizedDeg >= 300 && normalizedDeg < 360) return rewards["purple"];
}

// Handle spin event
const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");

spinButton.addEventListener("click", async function () {
    // Disable button while spinning
    spinButton.disabled = true;

    // Generate a random spin angle between 1800deg - 3600deg
    let randomSpin = Math.floor(1800 + Math.random() * 1800);
    
    // Apply rotation to wheel
    wheel.style.transform = `rotate(${randomSpin}deg)`;

    // Wait for animation to complete
    setTimeout(async () => {
        // Calculate final angle
        let finalAngle = randomSpin % 360;

        // Determine reward based on color segment
        let pointsWon = getReward(finalAngle);

        // Update points
        userPoints += pointsWon;
        document.getElementById("points").innerText = userPoints;

        // Update RestDB with new points
        await updateUserPoints(userPoints);

        // Show alert with result
        alert(`🎉 You have won ${pointsWon} points!`);

        // Enable button after animation
        spinButton.disabled = false;
    }, 3000); // Matches CSS animation duration (3s)
});