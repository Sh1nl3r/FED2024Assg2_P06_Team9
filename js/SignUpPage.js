document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6796f5fcf9d2bbcd3d181e27";
  let url = 'https://randomuser.me/api/';

  document.getElementById("create-account-submit").addEventListener("click", function (e) {

      e.preventDefault();

      let newaccountName = document.getElementById("username").value.trim();
      let newaccountPassword = document.getElementById("password").value.trim();
      let newaccountEmail = document.getElementById("email").value.trim();

      if (!newaccountName || !newaccountPassword || !newaccountEmail) {
          alert("Please fill in all the fields.");
          return;
      }

      // Fetch random profile picture
      fetch(url)
          .then(response => response.json())
          .then(function (data) {
              const user = data.results[0];
              const profilePicture = user.picture.medium; // Get the random image URL

              // Prepare data to store in RestDB
              let jsondata = {
                  "name": newaccountName,
                  "password": newaccountPassword,
                  "email": newaccountEmail,
                  "profilepic": profilePicture // Store profile picture URL in RestDB
              };

              let settings = {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "x-apikey": APIKEY,
                      "Cache-Control": "no-cache"
                  },
                  body: JSON.stringify(jsondata)
              };

              // Send data to RestDB
              return fetch("https://assg2fed-9901.restdb.io/rest/accounts", settings);
          })
          .then(response => {
              if (!response.ok) {
                  return response.json().then(err => {
                      throw new Error(err.message || "Failed to create account due to server error.");
                  });
              }
              return response.json();
          })
          .then(data => {
              console.log("Success:", data);
              // Clear form and provide feedback
              document.getElementById("signup-loginForm").reset();
              alert("Account successfully created!");
              window.location.href = "LoginPage.html";
          })
          .catch(error => {
              console.error("Error:", error);
              alert("Failed to create account. Please try again.");
          });
  });
});