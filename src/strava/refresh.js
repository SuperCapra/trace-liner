import 'dotenv/config';

export const refreshToken = async (refreshToken) => {
    let urlRefresh = process.env.VITE_STRAVA_HOST + process.env.VITE_TOKEN_DIRECTORY +
        '?client_id=' + process.env.VITE_STRAVA_CLIENT_ID + 
        '&client_secret=' + process.env.VITE_STRAVA_CLIENT_SECRET + 
        '&refresh_token=' + refreshToken +
        '&grant_type=refresh_token'
        
    const response = await fetch(urlRefresh, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Length': '0'
        },
    })

  return response.json()
}

export default {
  refreshToken
}