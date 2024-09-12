async function fetchProtectedData() {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await fetch('/api/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Protected data:', data);
        } else {
            console.error('Error fetching data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
