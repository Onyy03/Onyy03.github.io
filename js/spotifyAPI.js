// spotifyAPI.js

// Uzupełnij swoimi danymi z Developer Dashboard Spotify
const CLIENT_ID = "ab7aa6624d8a4279b5254be02bde966b";
const CLIENT_SECRET = "c3592771fa384b4a8a58e78c0264f170";

// Funkcja do pobierania tokena (Client Credentials Flow)
async function getAccessToken() {
  const url = "https://accounts.spotify.com/api/token";
  // Kodowanie client_id i client_secret w base64
  const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  // Wywołanie tokenu
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodedCredentials}`
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error(`Błąd uzyskiwania tokenu: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Funkcja do pobrania listy Top 50 Polska
// (podaj ID wybranej playlisty)
export async function getTop50Poland() {
  const playlistId = "37i9dQZEVXbN6itCcaL3Tt"; // przykładowe ID
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Błąd pobierania playlisty: ${response.status}`);
  }

  const data = await response.json();
  return data; 
  // data.items[] to tablica utworów (track/artist itp.)
}
