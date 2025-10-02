// ==========================
// Load Groups from groups.json
// ==========================
async function loadGroups() {
  try {
    const response = await fetch("groups.json");
    const groups = await response.json();

    const groupList = document.getElementById("group-list");
    groupList.innerHTML = "";

    groups.forEach(group => {
      const card = document.createElement("div");
      card.className = "group-card";

      card.innerHTML = `
        <h3>${group.name}</h3>
        <p>${group.description}</p>
        <a href="${group.link}" target="_blank">Join Group</a>
      `;

      groupList.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading groups:", err);
  }
}
loadGroups();

// ==========================
// Discord OAuth2 Login
// ==========================
const profileButton = document.getElementById("profile-button");
const logoutButton = document.getElementById("logout-button"); // add this in index.html
const userProfileDiv = document.getElementById("user-profile");
const statusDiv = document.getElementById("status");

// Redirect to Discord OAuth2
profileButton.addEventListener("click", () => {
  const clientId = "1420077800680853716"; 
  const redirectUri = encodeURIComponent("https://ffny.netlify.app/callback");
  const scope = "identify";
  const responseType = "code";

  window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
});

// ==========================
// Handle OAuth2 Callback
// ==========================
async function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("code")) {
    const code = params.get("code");

    try {
      const res = await fetch(`/.netlify/functions/discord-profile?code=${code}`);
      const user = await res.json();

      if (user.error) {
        statusDiv.textContent = "Login failed.";
        console.error("Discord error:", user);
        return;
      }

      // Save user in localStorage
      localStorage.setItem("discordUser", JSON.stringify(user));

      displayUserProfile(user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      statusDiv.textContent = "Error loading profile.";
    }
  } else {
    // Check if user is already stored
    const storedUser = localStorage.getItem("discordUser");
    if (storedUser) {
      displayUserProfile(JSON.parse(storedUser));
    }
  }
}
handleOAuthCallback();

// ==========================
// Display User Profile
// ==========================
function displayUserProfile(user) {
  userProfileDiv.innerHTML = "";

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

  const avatar = document.createElement("img");
  avatar.src = avatarUrl;
  avatar.alt = "Discord Avatar";
  avatar.width = 40;
  avatar.height = 40;
  avatar.style.borderRadius = "50%";
  avatar.style.verticalAlign = "middle";
  avatar.style.marginRight = "8px";

  const welcomeMessage = document.createElement("span");
  welcomeMessage.textContent = `Welcome, ${user.username}!`;

  userProfileDiv.appendChild(avatar);
  userProfileDiv.appendChild(welcomeMessage);

  // Toggle buttons
  profileButton.style.display = "none";
  if (logoutButton) logoutButton.style.display = "inline-block";
}

// ==========================
// Logout
// ==========================
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("discordUser");
    userProfileDiv.innerHTML = "";
    profileButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  });
}
