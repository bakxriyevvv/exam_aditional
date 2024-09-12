async function loginUser(username, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = `/success/${data.userId}`; // misol uchun
        } else {
            const error = await response.json();
            console.error('Login failed:', error.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
