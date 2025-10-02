document.addEventListener('DOMContentLoaded', function() { // Wrap in DOMContentLoaded

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event listeners to the tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Deactivate all tab buttons and content areas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate the clicked button and corresponding content area
            const tabId = this.dataset.tab;
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    const groupListAdmin = document.getElementById('group-list-admin'); // Get admin group list
    const addGroupButton = document.getElementById('add-group-button'); // Get add group button

fetch('groups.json')
    .then(response => response.json())
    .then(data => {
        displayGroups(data);
    });

function displayGroups(data) {
    groupListAdmin.innerHTML = ''; // Clear existing content
    data.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group-admin-card');

        // Create input fields for each property (name, description, image URL, link)
        const nameInput = createInputField('name', group.name);
        const descriptionInput = createInputField('description', group.description);
        const imageUrlInput = createInputField('imageUrl', group.imageUrl);
        const linkInput = createInputField('link', group.link);

        groupDiv.appendChild(nameInput);
        groupDiv.appendChild(descriptionInput);
        groupDiv.appendChild(imageUrlInput);
        groupDiv.appendChild(linkInput);

        groupListAdmin.appendChild(groupDiv);
    });
}

function createInputField(propertyName, value) {
    const label = document.createElement('label');
    label.textContent = propertyName + ':';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = propertyName;
    input.value = value;
    return input;
}

addGroupButton.addEventListener('click', () => {
    // Create new input fields for a new group
    // Append them to groupListAdmin
});
});
