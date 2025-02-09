document.addEventListener("DOMContentLoaded", () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("No user logged in!");
        window.location.href = "login.html";
        return;
    }

    const checkValue = (value) => value && value.trim() !== "" ? value : "nil";

    // Populate profile fields
    document.getElementById("username").value = checkValue(loggedInUser.name);
    document.getElementById("first-name").value = checkValue(loggedInUser.firstname);
    document.getElementById("last-name").value = checkValue(loggedInUser.lastname);
    document.getElementById("bio").value = checkValue(loggedInUser.bio);
    document.getElementById("email").value = checkValue(loggedInUser.email);
    document.getElementById("phone-number").value = checkValue(loggedInUser.phone);

    // ✅ Profile Picture Handling
    const avatarUrl = loggedInUser.profilePicture ? loggedInUser.profilePicture : "images/default-avatar.png";

    document.getElementById("avatar").src = avatarUrl;
    document.getElementById("edit-profile-avatar").src = avatarUrl;

    // ✅ Upload Profile Picture
    document.querySelector(".upload-button").addEventListener("click", () => {
        alert("Profile picture upload feature is not implemented yet!");
    });

    // ✅ Save Changes
    document.querySelector(".save-button").addEventListener("click", async (event) => {
        event.preventDefault();

        const updatedUser = {
            name: document.getElementById("username").value,
            firstname: document.getElementById("first-name").value,
            lastname: document.getElementById("last-name").value,
            bio: document.getElementById("bio").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone-number").value,
            profilePicture: avatarUrl  // Keeping the same picture for now
        };

        try {
            const response = await fetch(`https://assg2fed-9901.restdb.io/rest/accounts/${loggedInUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": "6796f5fcf9d2bbcd3d181e27"
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error("Failed to save changes");

            // ✅ Update Local Storage with the New Data
            localStorage.setItem("loggedInUser", JSON.stringify({ ...loggedInUser, ...updatedUser }));
            alert("Profile updated successfully!");
            window.location.href = "profile.html"; // Redirect back to profile page
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error saving changes. Please try again.");
        }
    });
});
