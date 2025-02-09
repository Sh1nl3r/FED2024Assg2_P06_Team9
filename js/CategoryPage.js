
function navigateToCategory(category) {
    window.location.href = `SearchResult.html?query=${encodeURIComponent(category)}`;
  }
  const avatarElement = document.getElementById("avatar");
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (avatarElement && loggedInUser) {
      avatarElement.src = loggedInUser.profilePicture ? loggedInUser.profilePicture : "images/default-avatar.png";
  }
  
  