require('dotenv').config()

const refreshToken = async (refreshToken) => {
    let urlRefresh = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_TOKEN_DIRECTORY +
        '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
        '&client_secret=' + process.env.REACT_APP_STRAVA_CLIENT_SECRET + 
        '&refresh_token=' + refreshToken +
        '&grant_type=refresh_token'
        
    console.log('urlRefresh', urlRefresh)
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

module.exports = {
  refreshToken
}