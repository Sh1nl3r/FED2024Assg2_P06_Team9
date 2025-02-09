document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6796f5fcf9d2bbcd3d181e27";
    const API_URL = " https://assg2fed-9901.restdb.io/rest/listings";
    const MEDIA_URL = " https://assg2fed-9901.restdb.io/media";

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    const form = document.getElementById("listingForm");
    const listBtn = document.querySelector(".list-btn");
    const statusMessage = document.createElement("p");
    statusMessage.id = "statusMessage";
    form.appendChild(statusMessage);

    listBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        // Retrieve logged-in user from localStorage
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        let sellerName = loggedInUser ? loggedInUser.name : "Unknown Seller";  // Fallback if no user is found

        let title = document.getElementById("title").value;
        let price = parseFloat(document.getElementById("price").value);
        let category = document.getElementById("category").value;
        let description = document.getElementById("description").value;
        let meetup = document.getElementById("meetup").checked;
        let delivery = document.getElementById("delivery").checked;
        let imageFile = document.getElementById("image").files[0];

        let imageUrl = "";

        // Handle image upload if an image is selected
        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);

            try {
                let imageResponse = await fetch(MEDIA_URL, {
                    method: "POST",
                    headers: { "x-apikey": APIKEY },
                    body: formData,
                });

                if (!imageResponse.ok) throw new Error(`Image upload failed: ${imageResponse.statusText}`);

                let imageData = await imageResponse.json();
                if (imageData.ids && imageData.ids.length > 0) {
                    imageUrl = `https://assg2fed-9901.restdb.io/media/${imageData.ids[0]}`;
                }
            } catch (error) {
                console.error("Image upload failed:", error);
                statusMessage.innerText = "Image upload failed.";
                return;
            }
        }

        let jsondata = {
            title: title,
            description: description,
            price: price,
            category: category,
            meetup: meetup,
            delivery: delivery,
            image: imageUrl,
            seller: sellerName  // Add seller's name to the listing
        };

        let settings = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache",
            },
            body: JSON.stringify(jsondata),
        };

        try {
            let response = await fetch(API_URL, settings);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            statusMessage.innerText = "Listing created successfully!";
            form.reset();
        } catch (error) {
            console.error("Error creating listing:", error);
            statusMessage.innerText = "Failed to create listing.";
        }
    });
});
