document.addEventListener('DOMContentLoaded', () => {
    const savedData = JSON.parse(localStorage.getItem('profileData')) || {};
    const feedbackForm = document.getElementById('feedback-form');
    const headerProfileImg = document.getElementById('header-profile-img');
    const status = document.getElementById('feedback-status');
    const totalText = localStorage.getItem('lastOrderTotal') || '$0.00';

    document.getElementById('feedback-name').value = savedData.fullName || '';
    document.getElementById('feedback-total').innerText = `Total paid: ${totalText}`;

    if (savedData.profilePic) {
        headerProfileImg.src = savedData.profilePic;
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach((el) => {
            el.innerText = '';
        });
    }

    document.getElementById('submit-feedback-btn').addEventListener('click', () => {
        clearErrors();

        const name = document.getElementById('feedback-name').value.trim();
        const rating = document.getElementById('feedback-rating').value;
        const message = document.getElementById('feedback-message').value.trim();
        let valid = true;

        if (!name) {
            document.getElementById('feedback-name-error').innerText = 'Name cannot be empty.';
            valid = false;
        }

        if (!rating) {
            document.getElementById('feedback-rating-error').innerText = 'Please select a rating.';
            valid = false;
        }

        if (!message) {
            document.getElementById('feedback-message-error').innerText = 'Please enter your feedback.';
            valid = false;
        }

        if (!valid) {
            status.innerText = 'Fix errors';
            return;
        }

        const feedbackEntries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
        feedbackEntries.push({
            name,
            rating,
            message,
            submittedAt: new Date().toISOString(),
            orderTotal: totalText
        });

        localStorage.setItem('feedbackEntries', JSON.stringify(feedbackEntries));
        feedbackForm.reset();
        document.getElementById('feedback-name').value = savedData.fullName || '';
        status.innerText = 'Saved';
        alert('Thanks for your feedback!');
        window.location.href = '../index.html';
    });
});
