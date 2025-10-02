// app.js
const groupList = document.getElementById('group-list');
const statusDiv = document.getElementById('status'); // Get the status div

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
    console.log('loadGroups called'); // Add this line
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json(); // Parse the JSON
        groupList.innerHTML = ''; // Clear existing content
        data.forEach(group => { // Iterate directly over the array
            const groupCard = document.createElement('a'); // Change to <a> tag
            groupCard.href = group.link; // Set the link
            groupCard.classList.add('group-card');

            const img = document.createElement('img'); // Create the image element
            img.src = escapeHTML(group.imageUrl);
            img.alt = escapeHTML(group.name);
            groupCard.appendChild(img); // Add image first

            const h3 = document.createElement('h3');
            h3.textContent = escapeHTML(group.name);
            groupCard.appendChild(h3);

            const p = document.createElement('p');
            p.textContent = escapeHTML(group.description);
            groupCard.appendChild(p);

            groupList.appendChild(groupCard);
        });

        statusDiv.textContent = ''; // Clear the "Loading groups..." message
        // OR
        // statusDiv.style.display = 'none'; // Hide the status div

    } catch (error) {
        console.error('Error loading groups:', error);
        console.error('Error details:', error.message, error.stack); // Log more details
        statusDiv.textContent = 'Failed to load groups. Please try again later.'; // Update error message
    }
}

loadGroups(); // Call loadGroups to populate data when the script loads
