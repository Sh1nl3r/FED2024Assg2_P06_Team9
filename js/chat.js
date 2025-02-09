const RESTDB_API_KEY = "6796f5fcf9d2bbcd3d181e27"; // Replace with your actual RestDB API Key
const RESTDB_URL = "https://assg2fed-9901.restdb.io/rest/messages"; // Replace with your actual RestDB collection URL

let currentUser = localStorage.getItem("currentUser") || "User 1";

// ✅ Retrieve and display the listing details from localStorage
document.addEventListener("DOMContentLoaded", function () {
    displayListingDetails(); // Load listing details when the page is ready
    loadMessages(); // Load chat messages
    setupChatInput(); // ✅ Ensures the event listener is only added once
});

// ✅ Function to display listing details
function displayListingDetails() {
    const listing = JSON.parse(localStorage.getItem("currentChatListing"));

    if (!listing) {
        console.error("No listing found in localStorage.");
        return;
    }

    const usernameElement = document.querySelector(".username");
    const itemNameElement = document.querySelector(".item-name");
    const descriptionElement = document.querySelector(".description");
    const priceElement = document.querySelector(".price");
    const itemPhotoElement = document.querySelector(".item-photo");
    const imageIconElement = document.querySelector(".image-icon"); // Select image icon

    if (!usernameElement || !itemNameElement || !descriptionElement || !priceElement || !itemPhotoElement || !imageIconElement) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    // ✅ Store seller name in localStorage for FeedbackPage
    localStorage.setItem("feedbackSeller", listing.seller);

    usernameElement.textContent = listing.seller || "Unknown Seller";
    itemNameElement.textContent = listing.title || "Unknown Item";
    descriptionElement.textContent = listing.description || "No description available.";
    priceElement.textContent = `Price: $${listing.price || "N/A"}`;

    itemPhotoElement.innerHTML = `<img src="${listing.photo || "images/default-image.png"}" 
                                  alt="${listing.title}" style="width: 100px; height: 100px; border-radius: 10px;">`;

    // ✅ Add event listener to image icon to navigate to FeedbackPage
    imageIconElement.addEventListener("click", function () {
        window.location.href = "FeedbackPage.html";
    });
}


// ✅ Load messages from RestDB
async function loadMessages() {
    const chatBox = document.querySelector(".chat-container");
    chatBox.innerHTML = ""; // ✅ Clear chat box before reloading messages

    try {
        const response = await fetch(RESTDB_URL, {
            headers: { "x-apikey": RESTDB_API_KEY }
        });
        const messages = await response.json();

        // ✅ Use a Set to track displayed messages (prevents duplication)
        const displayedMessages = new Set();

        messages.forEach(msg => {
            if (!displayedMessages.has(msg.timestamp)) { // ✅ Check if message already displayed
                displayedMessages.add(msg.timestamp); // ✅ Mark message as displayed

                let messageElement = document.createElement("div");
                messageElement.classList.add("message");

                if (msg.user === currentUser) {
                    messageElement.classList.add("right"); // Aligns message to the right
                } else {
                    messageElement.classList.add("left"); // Aligns message to the left
                }

                messageElement.innerHTML = `<div class="message-bubble">${msg.message}</div>`;
                chatBox.appendChild(messageElement);
            }
        });

        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}


// ✅ Send a new message to RestDB (Prevents Double Send)
async function sendMessage(event) {
    if (event) event.preventDefault(); // ✅ Prevents form submission if inside a form

    const input = document.querySelector(".chat-input input");
    const text = input.value.trim();

    if (text === "") return;

    const newMessage = {
        user: currentUser,
        message: text,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(RESTDB_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": RESTDB_API_KEY
            },
            body: JSON.stringify(newMessage)
        });

        input.value = ""; // Clear input field
        loadMessages(); // Reload messages after sending
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// ✅ Ensure Event Listener is Added Only Once
function setupChatInput() {
    const inputField = document.querySelector(".chat-input input");

    if (!inputField.dataset.listenerAdded) {
        inputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage(event);
            }
        });

        inputField.dataset.listenerAdded = "true"; // ✅ Marks that a listener has been added
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sellerName = localStorage.getItem("feedbackSeller");

    if (sellerName) {
        document.querySelector(".seller-name").textContent = sellerName;
    } else {
        console.error("No seller name found in localStorage.");
    }
});

document.querySelector(".image-icon").addEventListener("click", function () {
    window.location.href = "FeedbackPage.html"; // ✅ Redirect to FeedbackPage
});


// ✅ Load listing details and messages on page load
window.onload = function () {
    displayListingDetails();
    loadMessages();
};
