document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://assg2fed-9901.restdb.io/rest/userreview";
    const USER_API_URL = "https://assg2fed-9901.restdb.io/rest/accounts"; // Correct users collection
    const API_KEY = "6796f5fcf9d2bbcd3d181e27";
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let sellerName = localStorage.getItem("selectedSeller"); // Store seller's name in localStorage

    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    // ⭐ Star Rating System
    const stars = document.querySelectorAll(".star");
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            stars.forEach(s => s.classList.remove("active"));
            this.classList.add("active");
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add("active");
            }
        });
    });

    // 🏷️ Selectable Traits
    const traitButtons = document.querySelectorAll(".trait-btn");
    let selectedTraits = [];

    traitButtons.forEach(button => {
        button.addEventListener("click", function () {
            const trait = this.textContent;
            if (selectedTraits.includes(trait)) {
                selectedTraits = selectedTraits.filter(t => t !== trait);
                this.classList.remove("active");
            } else {
                selectedTraits.push(trait);
                this.classList.add("active");
            }
        });
    });

    // ✅ Submit Review and Update Seller's Review Count
    document.getElementById("submit-review").addEventListener("click", async function () {
        const comment = document.getElementById("comment-box").value.trim();

        if (selectedRating === 0) {
            alert("Please select a star rating.");
            return;
        }

        if (!sellerName) {
            alert("Seller information is missing.");
            return;
        }

        try {
            // Step 1: Find Seller's Account
            const sellerResponse = await fetch(`${USER_API_URL}?q={"name": "${sellerName}"}&metafields=true`, {
                headers: { "x-apikey": API_KEY }
            });
            const sellerData = await sellerResponse.json();

            if (sellerData.length === 0) {
                alert("Seller not found.");
                return;
            }

            const seller = sellerData[0]; // Get first matching seller
            const sellerId = seller._id;
            const currentReviews = seller.reviews || 0; // Default to 0 if no reviews

            // Step 2: Submit Review
            const reviewData = {
                "seller": sellerName,
                "starrating": selectedRating,
                "traits": selectedTraits,
                "comments": comment
            };

            const reviewResponse = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": API_KEY,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(reviewData)
            });

            const reviewResult = await reviewResponse.json();
            console.log("Review Submitted:", reviewResult);

            // Step 3: Update Seller's Review Count (+1)
            const updatedSellerData = { reviews: currentReviews + 1 };

            const updateSellerResponse = await fetch(`${USER_API_URL}/${sellerId}?metafields=true`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": API_KEY
                },
                body: JSON.stringify(updatedSellerData)
            });

            const updatedSeller = await updateSellerResponse.json();
            console.log("Seller Updated:", updatedSeller);

            alert("Review submitted successfully!");

            // Reset form
            selectedRating = 0;
            selectedTraits = [];
            document.getElementById("comment-box").value = "";
            stars.forEach(s => s.classList.remove("active"));
            traitButtons.forEach(b => b.classList.remove("active"));
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        }
    });
});
