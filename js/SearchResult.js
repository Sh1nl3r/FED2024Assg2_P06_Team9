document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query")?.toLowerCase() || "";
    const resultsContainer = document.getElementById("search-results");

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const avatarElement = document.getElementById("avatar");
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "assets/default-avatar.png";
    }

    if (!query) {
        resultsContainer.innerHTML = "<p>No search query provided.</p>";
        return;
    }

    try {
        const response = await fetch("https://assg2fed-9901.restdb.io/rest/listings?metafields=true", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "6796f5fcf9d2bbcd3d181e27",
            },
        });

        const data = await response.json();

        // Filter results based on search query
        const filteredResults = data.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = "<p>No items found matching your search.</p>";
            return;
        }

        // ✅ Display search results
        for (let item of filteredResults) {
            const resultCard = document.createElement("div");
            resultCard.classList.add("card");

            // ✅ Fetch image URL properly
            const imageUrl = item.image?.length ? await fetchImageUrl(item.image[0]) : "assets/default-image.png";

            // ✅ Calculate how many days ago the listing was posted
            const createdDate = item._created ? new Date(item._created) : null;
            const currentDate = new Date();
            const timeDifference = createdDate ? Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24)) : "N/A";
            const daysAgo = createdDate ? `${timeDifference}` : "N/A";

            resultCard.innerHTML = `
                <a href="listDetails.html?id=${item._id}" class="listing-link">
                    <div class="card-header">
                        <div class="listing-username">${item.seller || "Unknown Seller"}</div>
                        <div class="listing-time">${daysAgo} days ago</div>
                    </div>
                    <div class="card-photo">
                        <img src="${imageUrl}" alt="${item.title}" 
                            onerror="this.onerror=null; this.src='assets/default-image.png';" 
                            style="width: 100%; height: auto; border-radius: 10px;">
                    </div>
                    <div class="card-details">
                        <h3>${item.title}</h3>
                        <p>${item.description || "No description available"}</p>
                        <p><strong>Price:</strong> $${item.price || "N/A"}</p>
                        <p><strong>Category:</strong> ${item.category || "N/A"}</p>
                        <p><strong>Meetup Available:</strong> ${item.meetup ? "Yes" : "No"}</p>
                        <p><strong>Delivery Available:</strong> ${item.delivery ? "Yes" : "No"}</p>
                    </div>
                </a>
                <button class="chat-button" 
                    data-id="${item._id}" 
                    data-title="${item.title}" 
                    data-price="${item.price}" 
                    data-image="${imageUrl}" 
                    data-description="${item.description}" 
                    data-seller="${item.seller || 'Unknown Seller'}">Chat</button>
            `;


            resultsContainer.appendChild(resultCard);
        }

        // ✅ Add event listeners to chat buttons
        document.querySelectorAll(".chat-button").forEach(button => {
            button.addEventListener("click", (event) => {
                const chatData = {
                    id: event.target.dataset.id,
                    seller: event.target.dataset.seller,  // ✅ Include seller's name
                    title: event.target.dataset.title,
                    price: event.target.dataset.price,
                    image: event.target.dataset.image,
                    description: event.target.dataset.description
                };

                // Store in localStorage
                localStorage.setItem("currentChatListing", JSON.stringify(chatData));

                // Redirect to chat.html
                window.location.href = `chat.html`;
            });
        });

    } catch (error) {
        console.error("Error fetching search results:", error);
        resultsContainer.innerHTML = "<p>Error loading search results.</p>";
    }
});

// ✅ Fetch Image with API Key
async function fetchImageUrl(imageId) {
    try {
        if (!imageId) return "assets/default-image.png"; // Return default if no image ID

        const response = await fetch(`https://assg2fed-9901.restdb.io/media/${imageId}`, {
            method: "GET",
            headers: {
                "x-apikey": "6796f5fcf9d2bbcd3d181e27",
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        return response.url; // ✅ Return direct image URL
    } catch (error) {
        console.error("Error fetching image:", error);
        return "assets/default-image.png"; // Fallback image
    }
}
