document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === "admin" && password === "password") {
    alert("Login successful!");
    // Redirect to another page or perform other actions here
  } else {
    alert("Invalid username or password.");
  }
});