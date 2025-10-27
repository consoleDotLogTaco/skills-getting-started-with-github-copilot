document.addEventListener('DOMContentLoaded', () => {
    const activitiesList = document.getElementById('activities-list');
    const activitySelect = document.getElementById('activity');
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

    // Fetch and display activities
    fetch('/activities')
        .then(response => response.json())
        .then(activities => {
            activitiesList.innerHTML = '';
            Object.entries(activities).forEach(([name, details]) => {
                const card = document.createElement('div');
                card.className = 'activity-card';
                card.innerHTML = `
                    <h4>${name}</h4>
                    <p><strong>Description:</strong> ${details.description}</p>
                    <p><strong>Schedule:</strong> ${details.schedule}</p>
                    <p><strong>Available Spots:</strong> ${details.max_participants - details.participants.length} of ${details.max_participants}</p>
                    <div class="participants-list">
                        <div class="participants-list-title">Current Participants:</div>
                        <ul>
                            ${details.participants.map(email => `<li>${email}</li>`).join('')}
                        </ul>
                    </div>
                `;
                activitiesList.appendChild(card);

                // Add to select dropdown
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                activitySelect.appendChild(option);
            });
        });

    // Handle form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const activity = activitySelect.value;

        fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message success';
            messageDiv.classList.remove('hidden');
            // Refresh the activities list
            location.reload();
        })
        .catch(error => {
            messageDiv.textContent = error.message;
            messageDiv.className = 'message error';
            messageDiv.classList.remove('hidden');
        });
    });
});
