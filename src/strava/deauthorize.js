import 'dotenv/config';

export const deauthorizeStrava = async (accessToken) => {
    let urlDeauthorize = process.env.VITE_STRAVA_HOST + process.env.VITE_DEAUTHORIZE_DIRECTORY +
        '?access_token=' + accessToken
  
    const response = await fetch(urlDeauthorize, {
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
  deauthorizeStrava
}