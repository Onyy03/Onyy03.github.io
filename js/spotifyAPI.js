const CLIENT_ID = '00315ad01bc34724861b3ba15cde8014';
const REDIRECT_URI = 'http://127.0.0.1:5500/button.html';
const SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';


// Logowanie przez Spotify
function loginSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=token`;
    window.location = authUrl;
}

// Pobieranie danych użytkownika
async function getUserData(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    return response.json();
}

// Obsługa redirect po zalogowaniu
async function handleRedirect() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1).split('&').reduce((acc, item) => {
            const parts = item.split('=');
            acc[parts[0]] = decodeURIComponent(parts[1]);
            return acc;
        }, {});

        window.location.hash = '';

        const token = hash.access_token;
        if (token) {
            localStorage.setItem('spotify_token', token);
            const profile = await getUserData(token);
            localStorage.setItem('spotify_user', JSON.stringify(profile));

            console.log('Zalogowano jako:', profile);
            window.location = 'test.html';
        }
    }
}

// Pobieranie danych artysty
async function getArtist(artistId, token) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    return await response.json();
}

// Funkcja testowa – używana na test.html
async function testSpotifyAPI() {
    try {
        const token = localStorage.getItem('spotify_token');
        if (!token) {
            throw new Error('Brak tokenu w pamięci. Zaloguj się ponownie.');
        }

        const artistId = '4Z8W4fKeB5YxbusRsdQVPb'; // Radiohead
        const artistData = await getArtist(artistId, token);
        
        document.getElementById('artist-info').innerHTML = `
            <h2>${artistData.name}</h2>
            <p>Gatunki: ${artistData.genres.join(', ')}</p>
            <p>Obserwujący: ${artistData.followers.total}</p>
            <img src="${artistData.images[0].url}" width="300">
        `;
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        document.getElementById('artist-info').textContent = error.message;
    }
}


// Pobieranie utworów z playlisty "Top 50 USA" (ID znane z dokumentacji Spotify)
async function getTop50Playlist(token, playlistId) {
    try {
        console.log(`Pobieranie playlisty: ${playlistId}`);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Błąd pobierania playlisty:', errorData);
            throw new Error(`Błąd pobierania playlisty: ${errorData.error.message}`);
        }

        const data = await response.json();
        console.log('Pobrane utwory:', data);

        // Wyświetlanie playlisty na stronie
        const playlistContainer = document.getElementById('playlist-info');
        playlistContainer.innerHTML = "<h2>Top 50 USA</h2>";

        data.items.forEach(item => {
            const track = item.track;
            playlistContainer.innerHTML += `
                <p><strong>${track.name}</strong> - ${track.artists.map(artist => artist.name).join(', ')}</p>
                <audio controls>
                    <source src="${track.preview_url}" type="audio/mpeg">
                    Brak podglądu utworu
                </audio>
            `;
        });

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        document.getElementById('playlist-info').textContent = error.message;
    }
}

