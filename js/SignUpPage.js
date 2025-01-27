document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "6795facd2e42643b7fd2398d";

document.getElementById("create-account-submit").addEventListener("click", function (e) {
  // Prevent default action of the button 
  e.preventDefault();

  let newaccountName = document.getElementById("username").value;
  let newaccountPassword = document.getElementById("password").value;
  let newaccountEmail = document.getElementById("email").value;

  if (!newaccountName || !newaccountPassword || !newaccountEmail) {
    alert("Please fill in all the fields.");
    return;
  }

  let jsondata = {
    "name": newaccountName,
    "password": newaccountPassword,
    "email": newaccountEmail
  };

  let settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    },    
    body: JSON.stringify(jsondata)
  }

  fetch("https://assignment2accounts-4371.restdb.io/rest/accounts", settings)
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
      window.location.href = "Login.html";
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to create account. Please try again.");
    });
    });
});