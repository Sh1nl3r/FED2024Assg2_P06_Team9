document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.getElementById("trending-carousel");
    let currentIndex = 0;

    const avatarElement = document.getElementById("avatar");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (avatarElement && loggedInUser) {
        avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "images/default-avatar.png";
    }

    // ✅ Fetch trending listings
    fetch("https://assg2fed-9901.restdb.io/rest/listings?metafields=true", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": "6796f5fcf9d2bbcd3d181e27",
        },
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const createdDate = item._created ? new Date(item._created) : new Date();
            const daysAgo = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));

            const slide = document.createElement("div");
            slide.classList.add("carousel-slide");

            slide.innerHTML = `
                <div class="item-details">
                    <h3>${item.title || "No Title"}</h3>
                    <p>Price: $${item.price || "N/A"}</p>
                    <p>${daysAgo} days ago</p>
                    <p>Category: ${item.category || "Unknown"}</p>
                    <p>${item.description || "No description available"}</p>
                </div>
                <div class="item-photo">
                    <a href="listDetails.html?id=${item._id}">
                        <img src="${item.image || "images/default-image.png"}" alt="${item.title || "No Title"}">
                    </a>
                </div>
                <div class="seller-info">
                    <h3><strong>${item.seller || "Unknown Seller"}</strong></h3>
                    <p>Delivery: ${item.delivery ? "Yes" : "No"}</p>
                    <p>Meetup: ${item.meetup ? "Yes" : "No"}</p>
                </div>
            `;

            carouselContainer.appendChild(slide);
        });
        updateCarousel();
    })
    .catch(error => console.error("Error fetching data:", error));

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
    }

    document.querySelector(".prev-btn").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    document.querySelector(".next-btn").addEventListener("click", () => {
        if (currentIndex < carouselContainer.children.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    document.getElementById("sellButton").addEventListener("click", function() {
        window.location.href = "makeList.html";
    });

    const profileButton = document.getElementById("user-profile");
    if (profileButton) {
        profileButton.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }

    // ✅ Fetch the latest 4 searches from RestDB
    const pastSearchesContainer = document.querySelector(".search-cards");
    fetch("https://assg2fed-9901.restdb.io/rest/listings?_sort=_created&_order=desc&_limit=4", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": "6796f5fcf9d2bbcd3d181e27",
        },
    })
    .then(response => response.json())
    .then(data => {
        pastSearchesContainer.innerHTML = "";

        data.forEach(item => {
            const searchCard = document.createElement("div");
            searchCard.classList.add("card");

            searchCard.innerHTML = `
                <a href="listDetails.html?id=${item._id}" class="search-card-link">
                    <div class="card-photo">
                        <img src="${item.image || "images/default-image.png"}" alt="${item.title || "Unknown"}">
                    </div>
                    <div class="card-details">
                        <p><strong>${item.title || "Unknown"}</strong></p>
                        <p>Price: ${item.price || "N/A"}</p>
                        <p>Category: ${item.category || "Unknown"}</p>
                        <p>${item.description || "No description available"}</p>
                    </div>
                </a>
                <button class="chat-button">Chat</button>
            `;

            searchCard.querySelector(".chat-button").addEventListener("click", () => {
                localStorage.setItem("currentChatListing", JSON.stringify(item));
                window.location.href = "chat.html";
            });

            pastSearchesContainer.appendChild(searchCard);
        });
    })
    .catch(error => console.error("Error fetching recent searches:", error));

    // ✅ Search functionality
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            window.location.href = `SearchResult.html?query=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });

});
