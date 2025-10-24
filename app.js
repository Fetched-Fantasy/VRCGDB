// app.js
const groupList = document.getElementById('group-list');
const statusDiv = document.getElementById('status');
const profileButton = document.getElementById('profile-button');
const userProfileDiv = document.getElementById('user-profile');
const logoutButton = document.getElementById('logout-button');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('new-group-form');

// Helper function to escape HTML
function escapeHTML(str) {
    let p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

const DATA_URL = 'groups.json';

// Initialize the Netlify Identity widget
const identity = netlifyIdentity;
identity.init();

// Function to display user profile
function displayUserProfile(user) {
    userProfileDiv.innerHTML = '';

    // Create a link element
    const profileLink = document.createElement('a');
    profileLink.href = "/settings";
    const avatar = document.createElement('img');
    avatar.src = user.user_metadata.avatar_url || 'default-avatar.png';
    avatar.alt = 'Google Avatar';
    avatar.width = 40;
    avatar.height = 40;
    avatar.style.borderRadius = '50%';
    avatar.style.verticalAlign = 'middle';
    avatar.style.marginRight = '8px';

  profileLink.appendChild(avatar); //Append the avatar to the link

    const welcomeMessage = document.createElement('span');
  welcomeMessage.textContent = `Welcome, ${user.user_metadata.full_name}!`;

    profileLink.appendChild(welcomeMessage)
    userProfileDiv.appendChild(profileLink);


    profileButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
}

// Event listener for the login button
profileButton.addEventListener('click', () => {
    identity.open();
  });

// Load groups function
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
            groupCard.classList.add('col-md-4');

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

loadGroups();

// Example: Call loadGroups AFTER you confirm user is logged in
netlifyIdentity.on('login', user => {
    console.log('login', user);
    displayUserProfile(user);
    loadGroups();
});

// Example: Call when user has logged out
netlifyIdentity.on('logout', () => {
    console.log('Logged out');
    profileButton.style.display = 'block';
    logoutButton.style.display = 'none';
});

// Example: Call when a user has signed up
netlifyIdentity.on('signup', user => {
  console.log('signup', user);
});

// Example: Call when a user has confirmed their account
netlifyIdentity.on('confirm', user => {
  console.log('confirmed', user);
});

// Example: Call when a user is recovered
netlifyIdentity.on('recovery', user => {
  console.log('recovery', user);
});

// Example: Call when the modal is closed
netlifyIdentity.on('close', () => {
  console.log('Widget closed');
});

// Function to update profile picture
document.getElementById('upload-profile-picture').addEventListener('click', function () {
    var imageUrl = document.getElementById('new-profile-picture-url').value;
    if (imageUrl) {
        localStorage.setItem('profilePictureURL', imageUrl);
    }
});

// Check for stored profile picture on page load
window.onload = function () {
    var storedImageUrl = localStorage.getItem('profilePictureURL');
    const profileImage = document.querySelector('img');
    if (storedImageUrl) {
        profileImage.src = storedImageUrl;
    }
};

searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const groupCards = document.querySelectorAll('.group-card');

    groupCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

          if (name.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
        }
    });
});


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('group-name').value;
    const description = document.getElementById('group-description').value;
    const imageUrl = document.getElementById('group-image-url').value;
    const link = document.getElementById('group-link').value;

    const newGroup = {name, description, imageUrl, link};

    // Initialize Ably
    const ably = new Ably.Realtime({key: 'YOUR_ABLY_API_KEY'});
    const channel = ably.channels.get('group-updates');

    // Publish the new group data to Ably
    await channel.publish('new-group', newGroup);

    // Clear the form
    form.reset();
});

// Subscribe to Ably channel for group updates
const ably = new Ably.Realtime({key: 'YOUR_ABLY_API_KEY'});
const channel = ably.channels.get('group-updates');

channel.subscribe('new-group', function (message) {
    const newGroup = message.data;
    // Add the new group to the group list
    addGroupToUI(newGroup);
});

function addGroupToUI(group) {
    const groupCard = document.createElement('a');
    groupCard.href = group.link;
    groupCard.target = "_blank";
    groupCard.classList.add('group-card');
    groupCard.classList.add('col-md-4');

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
}
