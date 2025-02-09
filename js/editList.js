document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    const selectedListing = JSON.parse(localStorage.getItem("selectedListing"));
    if (!selectedListing) {
        alert("No listing selected.");
        window.location.href = "profile.html";  
        return;
    }

    

    // Populate form with listing data
    document.getElementById("title").value = selectedListing.title;
    document.getElementById("price").value = selectedListing.price;
    document.getElementById("category").value = selectedListing.category;
    document.getElementById("description").value = selectedListing.description;
    document.getElementById("meetUp").checked = selectedListing.meetUp || false;
    document.getElementById("delivery").checked = selectedListing.delivery || false;

    // Display existing images
    const photoPreview = document.getElementById("photoPreview");
    if (selectedListing.images && selectedListing.images.length > 0) {
        selectedListing.images.forEach((image, index) => {
            const div = document.createElement("div");
            div.classList.add("photo-item");
            div.innerHTML = `<img src="${image}" width="80"><button data-index="${index}">❌</button>`;
            photoPreview.appendChild(div);
        });
    }

    // Handle deleting images
    document.getElementById("photoPreview").addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            e.target.parentElement.remove();
        }
    });

    // Handle form submission
    document.getElementById("editListingForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const updatedListing = {
            title: document.getElementById("title").value,
            price: document.getElementById("price").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            meetUp: document.getElementById("meetUp").checked,
            delivery: document.getElementById("delivery").checked,
        };

        try {
            const APIKEY = "6796f5fcf9d2bbcd3d181e27";
            const API_URL = `https://assg2fed-9901.restdb.io/rest/listings/${selectedListing._id}`;

            let response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                },
                body: JSON.stringify(updatedListing),
            });

            if (!response.ok) throw new Error("Failed to update listing");

            alert("Listing updated successfully!");
            window.location.href = "profile.html";  
        } catch (error) {
            console.error("Error updating listing:", error);
        }
    });
});
