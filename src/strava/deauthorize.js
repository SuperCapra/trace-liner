require('dotenv').config()

const deauthorizeStrava = async (accessToken) => {
    let urlDeauthorize = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_DEAUTHORIZE_DIRECTORY +
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

module.exports = {
  deauthorizeStrava
}