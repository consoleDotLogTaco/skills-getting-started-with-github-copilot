document.addEventListener('DOMContentLoaded', () => {
    const activitiesList = document.getElementById('activities-list');
    const activitySelect = document.getElementById('activity');
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

    // Function to refresh activities display
    function refreshActivities() {
        return fetch('/activities')
            .then(response => response.json())
            .then(activities => {
                activitiesList.innerHTML = '';
                activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
                
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
                            <ul style="list-style-type: none;">
                                ${details.participants.map(email => `
                                    <li>
                                        <span>${email}</span>
                                        <button class="delete-participant" data-activity="${name}" data-email="${email}">
                                            <span class="delete-icon">×</span>
                                        </button>
                                    </li>
                                `).join('')}
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
    }

    // Initial load of activities
    refreshActivities();

    // Handle participant deletion
    activitiesList.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-participant');
        if (deleteButton) {
            const activity = deleteButton.dataset.activity;
            const email = deleteButton.dataset.email;

            fetch(`/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                messageDiv.textContent = data.message;
                messageDiv.className = 'message success';
                messageDiv.classList.remove('hidden');
                // Refresh the activities list
                return refreshActivities();
            })
            .catch(error => {
                messageDiv.textContent = error.message;
                messageDiv.className = 'message error';
                messageDiv.classList.remove('hidden');
            });
        }
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
