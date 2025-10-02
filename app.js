// app.js
const groupList = document.getElementById('group-list');

// A simple utility to prevent HTML injection from user input
function escapeHTML(str) {
    let p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

// The path to your data file.
// If you host this on GitHub, the URL will look like:
// 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/groups.json'
const DATA_URL = 'groups.json';

async function loadGroups() {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json(); // Parse the JSON
        groupList.innerHTML = ''; // Clear existing content
        data.forEach(group => { // Iterate directly over the array
            const groupCard = document.createElement('div');
            groupCard.classList.add('group-card');

            const h3 = document.createElement('h3');
            h3.textContent = escapeHTML(group.name);
            groupCard.appendChild(h3);

            const p = document.createElement('p');
            p.textContent = escapeHTML(group.description);
            groupCard.appendChild(p);

            const img = document.createElement('img');
            img.src = escapeHTML(group.imageUrl);
            img.alt = escapeHTML(group.name);
            groupCard.appendChild(img);

            groupList.appendChild(groupCard);
        });

    } catch (error) {
        console.error('Error loading groups:', error);
        console.error('Error details:', error.message, error.stack); // Log more details
        groupList.innerHTML = '<p>Failed to load groups. Please try again later.</p>';
    }
}

loadGroups(); // Call loadGroups to populate data when the script loads
