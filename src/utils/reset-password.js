document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('updatePasswordForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const response = await fetch(`/update-password/<%= user.id %>`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        const messageElement = document.getElementById('passwordChangeMessage');
        const errorElement = document.getElementById('errorMessage');

        if (result.success) {
            messageElement.style.display = 'block';
            errorElement.style.display = 'none';
            messageElement.textContent = 'Parol muvaffaqiyatli almashtirildi';
        } else {
            errorElement.style.display = 'block';
            messageElement.style.display = 'none';
            errorElement.textContent = result.error;
        }
    });
});
