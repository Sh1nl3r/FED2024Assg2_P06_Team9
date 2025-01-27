const APIKEY = "6795facd2e42643b7fd2398d";
  let settings = {
    method: "GET", //[cher] we will use GET to retrieve info
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    },
  }

document.getElementById('loginForm').addEventListener('submit', function(event) {
          event.preventDefault();

          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

  fetch("https://assignment2accounts-4371.restdb.io/rest/accounts", settings)
  .then(response => response.json())
  .then(response => {
    for (var i = 0; i < response.length; i++) {
          if (username === response[i].name && password === response[i].password) {
            alert("Login successful!");
            window.location.href = "index.html";
          }
          else if (username != response[i].name && password != response[i].password) {
            alert("Invalid username or password.");
          }
}});
    });