document.addEventListener('DOMContentLoaded', async function() {
    const apiUrl = ' https://assg2fed-9901.restdb.io/rest/listings';
    const apiKey = '6796f5fcf9d2bbcd3d181e27';

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    function getListingIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async function fetchListingDetails(listingId) {
        try {
            const response = await fetch(`${apiUrl}/${listingId}?metafields=true&metafields_only=false`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch listing details');
            }

            const listing = await response.json();
            console.log("Listing details fetched:", listing); // Debugging log
            displayListingDetails(listing);
        } catch (error) {
            console.error('Error fetching listing details:', error);
        }
    }

    function displayListingDetails(listing) {
        console.log("Displaying listing details:", listing);
    
        // Get elements safely
        const itemName = document.getElementById("item-name");
        const itemPrice = document.getElementById("item-price");
        const postedDate = document.getElementById("posted-date");
        const itemCategory = document.getElementById("item-category");
        const itemDescription = document.getElementById("item-description");
        const carouselImage = document.getElementById("carousel-image");
        const sellerUsername = document.getElementById("username");
        const userReviews = document.getElementById("user-reviews");
        const dealMethod = document.getElementById("deal-method"); // Make sure this ID exists in your HTML
    
        // Handle _created metadata (days ago)
        const createdDate = listing._created ? new Date(listing._created) : null;
        let daysAgoText = "N/A";
        if (createdDate) {
            const currentDate = new Date();
            const timeDifference = currentDate - createdDate;
            const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            daysAgoText = `Posted ${daysAgo} days ago`;
        }
    
        // Deal method logic (boolean values)
        let dealMethodsText = [];
        if (listing.meetup) dealMethodsText.push("Meet Up");
        if (listing.delivery) dealMethodsText.push("Delivery");
        const dealMethodText = dealMethodsText.length > 0 ? dealMethodsText.join(", ") : "Not specified";
    
        // Update UI Elements
        if (itemName) itemName.textContent = listing.title || "No name available";
        if (itemPrice) itemPrice.textContent = "$" + (listing.price || "0.00");
        if (postedDate) postedDate.textContent = daysAgoText;
        if (itemCategory) itemCategory.textContent = listing.category || "No category";
        if (itemDescription) itemDescription.textContent = listing.description || "No description available";
        if (carouselImage) carouselImage.setAttribute("src", listing.photo || "default-image.jpg");
        if (sellerUsername) sellerUsername.textContent = listing.seller || "Unknown Seller";
        if (userReviews) userReviews.textContent = (listing.reviews || "0") + " Reviews";
        if (dealMethod) dealMethod.textContent = dealMethodText; // Display formatted deal method
    }
    

    window.onload = function () {
        const listingId = getListingIdFromURL();
        if (listingId) {
            fetchListingDetails(listingId);
        } else {
            console.error("Listing ID not found in URL");
        }
    };
});
