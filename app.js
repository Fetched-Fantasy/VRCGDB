// app.js
const groupList = document.getElementById('group-list');
const statusDiv = document.getElementById('status');
//const profileButton = document.getElementById('profile-button'); // Get the profile button - REMOVE THIS
const userProfileDiv = document.getElementById('user-profile');
function escapeHTML(str) {
    let p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}
const DATA_URL = 'groups.json';
const clientId = '1420077800680853716';
const redirectUri = encodeURIComponent(window.location.origin);
const scope = 'identify';
const responseType = 'code';
const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profile-button');
profileButton.addEventListener('click', () => {
        // Redirect the user to the Discord authentication URL
    window.location.href = discordAuthUrl;
    });
});
async function loadGroups() {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        groupList.innerHTML = '';
        data.forEach(group => {
            const groupCard = document.createElement('a');
            groupCard.href = group.link;
            groupCard.target = "_blank"; // Add this line
            groupCard.classList.add('group-card');

            const img = document.createElement('img');
            img.src = escapeHTML(group.imageUrl);
            img.alt = escapeHTML(group.name);
            groupCard.appendChild(img);

            const h3 = document.createElement('h3');
            h3.textContent = escapeHTML(group.name);
            groupCard.appendChild(h3);

            const p = document.createElement('p');
            p.textContent = escapeHTML(group.description);
            groupCard.appendChild(p);

            groupList.appendChild(groupCard);
        });

        statusDiv.textContent = '';
    } catch (error) {
        console.error('Error loading groups:', error);
        console.error('Error details:', error.message, error.stack);
        statusDiv.textContent = 'Failed to load groups. Please try again later.';
    }
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[[\\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const authorizationCode = getParameterByName('code');
if (authorizationCode) {
    fetch('/.netlify/functions/discord-profile', {
        method: 'POST',
        body: JSON.stringify({ code: authorizationCode }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error fetching Discord profile:', data.error);
            statusDiv.textContent = 'Error logging in with Discord.';
        } else {
            displayUserProfile(data);
        }
    })
    .catch(error => {
        console.error('Error fetching Discord profile:', error);
        statusDiv.textContent = 'Error logging in with Discord.';
    });
}
function displayUserProfile(user) {
    const avatar = document.createElement('img');
    avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    avatar.alt = 'Discord Avatar';
    const welcomeMessage = document.createElement('span');
    welcomeMessage.textContent = `Welcome, ${user.username}!`;
    userProfileDiv.appendChild(avatar);
    userProfileDiv.appendChild(welcomeMessage);
}
loadGroups();

