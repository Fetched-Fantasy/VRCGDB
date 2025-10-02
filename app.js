// app.js
const groupList = document.getElementById('group-list');

// A simple utility to prevent HTML injection from user input
function escapeHTML(str) {
    const p = document.createElement('p');
    return p.innerHTML;
}

// The path to your data file.
// If you host this on GitHub, the URL will look like:
// 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/groups.json'
const DATA_URL = 'groups.json';

async function loadGroups() {
    try {
        const response = await fetch(DATA_URL);
        groups.forEach(group => {
            html += `
                <div class="group-card">
                    <h3>${escapeHTML(group.name)}</h3>
                    <p>${escapeHTML(group.description)}</p>
                    <img src="${escapeHTML(group.imageUrl)}" alt="${escapeHTML(group.name)}">
                </div>
            `;
        });

    } catch (error) {
        console.error('Error loading groups:', error);
        groupList.innerHTML = '<p>Failed to load groups. Please try again later.</p>';
    }
}