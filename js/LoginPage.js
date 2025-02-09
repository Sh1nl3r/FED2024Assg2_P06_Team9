document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch("https://assg2fed-9901.restdb.io/rest/accounts", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "x-apikey": "6796f5fcf9d2bbcd3d181e27",
          "Cache-Control": "no-cache"
      },
  })
  .then(response => response.json())
  .then(response => {
      let validUser = null;

      for (var i = 0; i < response.length; i++) {
          if (username === response[i].name && password === response[i].password) {
              validUser = response[i];
              break; 
          }
      }

      if (validUser) {
          alert("Login successful!");

          // Store user data in localStorage
          localStorage.setItem("loggedInUser", JSON.stringify({
              name: validUser.name,
              email: validUser.email,
              profilePicture: validUser.profilepic || "default-avatar.png" // Ensure fallback avatar
          }));

          // Redirect to index.html
          window.location.href = "index.html"; 

      } else {
          alert("Invalid username or password.");
      }
  })
  .catch(error => console.error("Login Error:", error));
});
