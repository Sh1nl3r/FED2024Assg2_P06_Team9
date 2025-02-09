document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = ' https://assg2fed-9901.restdb.io/rest/listings';
    const apiKey = '6796f5fcf9d2bbcd3d181e27';

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "default-avatar.png";
    }

    async function fetchListings() {
        try {
            const response = await fetch(`${apiUrl}?metafields=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Fetched listings:", data);

            displayListings(data);
            displayHotDeals(data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching recent listings:', error);
        }
    }

    function displayListings(listings) {
        const recentListingsContainer = document.querySelector('.recent-listings .cards-grid');
        if (!recentListingsContainer) {
            console.error("Error: '.recent-listings .cards-grid' not found in the DOM.");
            return;
        }

        recentListingsContainer.innerHTML = '';
        listings.forEach(listing => {
            const listingCard = createListingCard(listing);
            recentListingsContainer.appendChild(listingCard);
        });
    }

    function displayHotDeals(listings) {
        const hotDealsContainer = document.querySelector('.hot-deals .cards-row');
        if (!hotDealsContainer) {
            console.error("Error: '.hot-deals .cards-row' not found in the DOM.");
            return;
        }

        hotDealsContainer.innerHTML = '';
        listings.forEach(listing => {
            const listingCard = createListingCard(listing);
            hotDealsContainer.appendChild(listingCard);
        });
    }

    function createListingCard(listing) {
    const listingCard = document.createElement('div');
    const createdDate = new Date(listing._created);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    listingCard.classList.add('listing-card');
    listingCard.innerHTML = `
        <a href="listDetails.html?id=${listing._id}" class="listing-link">
            <div class="listing-header">
                <div class="profile-pic-small"></div>
                <div class="listing-username">${listing.seller}</div>
                <div class="listing-time">${daysAgo} days ago</div>
            </div>
            <div class="listing-photo">
                <img src="${listing.image ? listing.image.url : 'default-image.jpg'}" 
                     alt="${listing.title}" style="width: 100%; height: auto; border-radius: 10px;">
            </div>
            <div class="listing-details">
                <h3>${listing.title}</h3>
                <p>${listing.description}</p>
                <p>Price: $${listing.price}</p>
                <p>Category: ${listing.category}</p>
            </div>
        </a>
        <button class="chat-button">Chat</button>
    `;

    // ✅ Add event listener to the "Chat" button
    listingCard.querySelector(".chat-button").addEventListener("click", () => {
        const listingData = {
            id: listing._id,
            seller: listing.seller || "Unknown Seller",
            title: listing.title || "Unknown",
            photo: listing.image ? listing.image.url : "default-image.jpg",
            price: listing.price || "N/A",
            category: listing.category || "Unknown",
            description: listing.description || "No description available"
        };

        // Save listing details in localStorage
        localStorage.setItem("currentChatListing", JSON.stringify(listingData));

        // Redirect to chat.html
        window.location.href = "chat.html";
    });

    return listingCard;
}


    fetchListings();
});
