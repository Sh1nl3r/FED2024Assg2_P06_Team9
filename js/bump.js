const apiUrl = "https://assg2fed-9901.restdb.io/rest/listings"; 
const apiKey = "6796f5fcf9d2bbcd3d181e27";

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
    const avatarElement = document.getElementById("avatar");
    avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
}

// Retrieve selected listing from localStorage
let currentListing = JSON.parse(localStorage.getItem("selectedListing"));

if (!currentListing) {
    alert("⚠ No listing found. Redirecting...");
    window.location.href = "index.html"; // Redirect if no listing is found
} else {
    document.getElementById("listing-name").innerText = currentListing.title;
}

// Function to update bump count
async function updateBump(value) {
    if (!currentListing || !currentListing._id) {
        alert("❌ No valid listing selected.");
        return;
    }

    try {
        const newBumpCount = Math.max((currentListing.bump || 0) + value, 0);

        // Debugging logs
        console.log("Updating bump for:", currentListing);
        console.log("New bump count:", newBumpCount);
        console.log("Request URL:", `${apiUrl}/${currentListing._id}`);

        const response = await fetch(`${apiUrl}/${currentListing._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            },
            body: JSON.stringify({
                title: currentListing.title,
                price: currentListing.price,
                description: currentListing.description,
                category: currentListing.category,
                image: currentListing.image,
                seller: currentListing.seller,
                bump: newBumpCount // Updating only the bump count
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update bump count: ${errorText}`);
        }

        alert(`✅ Bump increased by ${value}! New bump count: ${newBumpCount}`);
        currentListing.bump = newBumpCount;
        localStorage.setItem("selectedListing", JSON.stringify(currentListing));
    } catch (error) {
        console.error("🚨 Error updating bump:", error);
        alert("⚠ Failed to update bump count. Check console for details.");
    }
}

