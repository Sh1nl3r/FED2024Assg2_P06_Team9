document.addEventListener("DOMContentLoaded", async function () {
    const APIKEY = "6796f5fcf9d2bbcd3d181e27";
    const API_URL = "https://assg2fed-9901.restdb.io/rest/listings";

    const avatarElement = document.getElementById("avatar");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Profile Picture Loading
    const avatarUrl = loggedInUser.profilePicture && loggedInUser.profilePicture.trim() !== "" 
        ? loggedInUser.profilePicture 
        : "default-avatar.png";

    document.getElementById("avatar").src = avatarUrl;
    document.getElementById("edit-profile-avatar").src = avatarUrl;

    const username = loggedInUser.name;
    document.querySelector(".user-details h2").innerText = username;
    document.querySelector(".user-details p").innerText = loggedInUser.email;

    // Apply profile picture to large profile pic
    const profilePicElement = document.querySelector(".profile-pic-large");
    if (profilePicElement) {
        profilePicElement.style.backgroundImage = `url('${loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png"}')`;
    } else {
        console.warn("⚠ Profile picture element not found.");
    }

    try {
        let response = await fetch(`${API_URL}?q={"seller":"${username}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch listings");

        let listings = await response.json();
        displayListings(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
});


function displayListings(listings) {
    const listingsContainer = document.querySelector(".listing-items");
    listingsContainer.innerHTML = ""; 

    if (listings.length === 0) {
        listingsContainer.innerHTML = "<p>No listings found.</p>";
        return;
    }

    listings.forEach(listing => {
        const listingCard = document.createElement("div");
        listingCard.classList.add("listing-card");

        listingCard.innerHTML = `
            <div class="listing-header">
                <div class="profile-pic-small" style="background-image: url('${listing.image || "default-item.png"}')"></div>
                <div class="listing-username">${listing.title}</div>
            </div>
            <div class="listing-photo">
                <img src="${listing.image || "default-item.png"}" alt="${listing.title}">
            </div>
            <div class="listing-details">
                <p><strong>${listing.description}</strong></p>
                <p>Price: $${listing.price}</p>
                <p>Category: ${listing.category}</p>
            </div>
            <div class="listing-actions">
                <button class="bump-button" data-id="${listing._id}">Bump</button>
                <button class="edit-button" data-id="${listing._id}">Edit</button>
            </div>
        `;

        listingsContainer.appendChild(listingCard);
    });

    // Make bump button work
    document.querySelectorAll(".bump-button").forEach(button => {
        button.addEventListener("click", function () {
            const listingId = this.getAttribute("data-id");
            const selectedListing = listings.find(item => item._id === listingId);

            if (selectedListing) {
                localStorage.setItem("selectedListing", JSON.stringify(selectedListing));
                window.location.href = "bump.html"; 
            }
        });
    });

    // Made edit button work
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", function () {
            const listingId = this.getAttribute("data-id");
            const selectedListing = listings.find(item => item._id === listingId);

            if (selectedListing) {
                localStorage.setItem("selectedListing", JSON.stringify(selectedListing));
                window.location.href = "editList.html"; 
            }
        });
    });

    document.querySelector(".edit-profile-link").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
    
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            localStorage.setItem("editProfileUser", JSON.stringify(loggedInUser)); // Save user data to local storage
        }
    
        window.location.href = "editProfile.html"; // Redirect to edit profile page
    });        
}   
