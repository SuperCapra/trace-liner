import './App.css';
import React from 'react';
import utils from './utils.js'
import Loader from './Loader.js'
import ButtonImage from './ButtonImage.js'
import imageDefault from './image.jpg'
const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET
const stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + 
  '/&response_type=code&scope=activity:read_all'

const image = new Image()

let called = false 
let athleteData = {}
let activities = []
let activity = {}
let accessToken
let isLoading = false
let isLoadingImage = false
let stage = 'ShowingActivity'
let stageHistory = ['ShowingActivity']
let stages = ['RequestedLogin','FetchingActivities','ShowingActivities','FetchingActivity','PersonalizingPhoto','ShowingActivity']

function App() {
  return (
    <Homepage />
  );
}

class Homepage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      stage : stage,
      stageHistory : stageHistory
    }
  }

  changeStage(value) {
    if(value.stage) {
      stage = value.stage
      if(value.stage === stages[0]) {
        stageHistory = [stages[0]]
      } else if(stageHistory[stageHistory.length - 1] !== value.stage) {
        stageHistory.push(value.stage)
      }
    }
    this.setState({
      stage : stage,
      stageHistory : stageHistory
    })
  }

  handleDownloadClick() {
    const canvas = this.canvasRef
    if(canvas) {
        const dataURL = canvas.toDataURL('image/png') // Convert canvas content to data URL
        const a = document.createElement('a')
        a.href = dataURL
        a.download = 'image_with_drawing.png' // Set the filename for the downloaded image
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
  }

  handleModifyClick() {
    console.log('handle modify!')
  }

  routesToStage() {
    isLoading = false
    let queryParameters = new URLSearchParams(window.location.search)
    let code = queryParameters.get('code')
    if(code && !called) {
      called = true
      this.getAccessTokenAndActivities(code)
    }
    if(isLoading || this.state.stage === 'FetchingActivities') {
      return (
        <Loader/>
      )
    } else {
      if(this.state.stage === 'RequestedLogin') {
        return (
          <div className="button-login justify-center-column" onClick={() => {
            window.location.href = stravaAuthorizeUrl
          }}><p className="p-login">LOGIN TO STRAVA</p></div>
        )
      } else if(this.state.stage === 'ShowingActivities') {
        let activitiesButton = activities.map(element => 
          <div key={element.id} className="button-activity justify-center-column" onClick={() => this.getActivity(element.id)}>
            <p className="title-activity">{element.name}</p>
            <p className="subtitle-activity">{element.subtitle}</p>
          </div>)
        return (
          activitiesButton
        )
      } else if(this.state.stage === 'ShowingActivity') {
        image.src = imageDefault;
        isLoadingImage = true
        return (
          <div>
              <canvas className="canvas-image"
                ref={(canvas) => {
                  this.canvasRef = canvas
                  if (canvas) {
                    const ctx = canvas.getContext('2d')
                    console.log('image:', image)
                    console.log('image:', image.src)
                    image.onload = () => {
                      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                      this.drawLine(ctx, activity.coordinates, canvas.width, canvas.height)
                      isLoadingImage = false
                    }
                  }
                }}
                width={1000}
                height={1000}
              />
              <ButtonImage clickShare={this.handleDownloadClick} clickModify={this.handleModifyClick}/>
          </div>
        )
      }
    }
  }

  getAccessTokenAndActivities(userCode) {
    isLoading = true
    console.log('getting the access token...')
    let urlAccessToken = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_TOKEN_DIRECTORY +
      '?client_id=' + clientId + 
      '&client_secret=' + clientSecret + 
      '&code=' + userCode +
      '&grant_type=authorization_code'
  
    fetch(urlAccessToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Length': '0'
      },
    }).then(response => response.json())
      .then(res => {
        console.log('res: ', res)
        accessToken = res.access_token
        athleteData = res.athlete
        console.log('athleteData: ', athleteData)
        if(accessToken) this.getActivities()
      })
      .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
  }

  drawLine(ctx, coodinates, width, height) {
    let border = width*0.2

    let minX = Math.min(...coodinates.map(x => x[0]))
    let maxX = Math.max(...coodinates.map(x => x[0]))
    let minY = Math.min(...coodinates.map(x => x[1]))
    let maxY = Math.max(...coodinates.map(x => x[1]))

    // console.log('minX:', minX)
    // console.log('maxX:', maxX)
    // console.log('minY:', minY)
    // console.log('maxY:', maxY)
    
    let mapWidth = maxX - minX
    let mapHeight = maxY - minY
    let mapCenterX = (minX + maxX) / 2
    let mapCenterY = (minY + maxY) / 2

    // console.log('mapWidth:', mapWidth)
    // console.log('mapHeight:', mapHeight)

    let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)

    // console.log('mapWidth*zoomFactor:', mapWidth*zoomFactor)
    // console.log('mapHeight*zoomFactor:', mapHeight*zoomFactor)

    // set line stroke and line width
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 4

    ctx.beginPath()

    for(let i = 0; i < coodinates.length; i++) {
      let c = coodinates[i]
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
    }

    ctx.stroke()
  }
  
  getActivities() {
    console.log('getting all the activities...')
    let urlActivities = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_ACTIVITY_DIRECTORY +
      '?access_token=' + accessToken
  
    fetch(urlActivities, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Length': '0'
      },
    }).then(response => response.json())
      .then(res => {
        console.log('res: ', res)
        if(res) {
          res.forEach(e => {
            console.log('Activity: ', e)
            let t = {
              name: e.name,
              sportType: utils.labelize(e.sport_type),
              duration: e.elapsed_time,
              beautyDuration: utils.getBeautyDuration(e.elapsed_time),
              distance: e.distance,
              distanceKm: Number((e.distance / 1000).toFixed(2)),
              locationCountry: e.location_country,
              movingTime: e.moving_time,
              startDate: e.start_date,
              beautyStartDate: utils.getBeautyDate(e.start_date),
              startDateLocal: e.start_date_local,
              startLatitude: e.start_latlng && e.start_latlng.length && e.start_latlng.length === 2 ? e.start_latlng[0] : undefined,
              startLongitude: e.start_latlng && e.start_latlng.length && e.start_latlng.length === 2 ? e.start_latlng[1] : undefined,
              endLatitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[0] : undefined,
              endLongitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[1] : undefined,
              id: e.id
            }
            t.subtitle = t.beautyStartDate + ' | ' + t.sportType + ' | ' + t.distanceKm + ' | ' + t.beautyDuration
            activities.push(t)
          })
        }
      })
      .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
      .finally(() => {
        isLoading = false
        this.changeStage({stage:'ShowingActivities'})
        console.log('activities: ', activities)
      })
  }

  getActivity(activityId) {
    isLoading = false
    this.changeStage({stage:'FetchingActivity'})
    console.log('getting activityId: ', activityId)
    let urlActivities = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_ACTIVITY_DIRECTORY + 
      '/' + activityId +
      '?access_token=' + accessToken
  
    fetch(urlActivities, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Length': '0'
      },
    }).then(response => response.json())
      .then(res => {
        console.log('res: ', res)
        if(res) {
          let indexActivity = activities.findIndex(x => x.id === activityId)
          activities[indexActivity].coordinates = utils.polylineToGeoJSON(res.map.polyline)
          activities[indexActivity].polyline = res.map.polyline
          activity = activities[indexActivity]
          console.log(activities)
        }
      })
      .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
      .finally(() => {
        isLoading = false
        this.changeStage({stage:'ShowingActivity'})
        console.log('activity: ', activity)
      })
  }


  render() {
    activity.coordinates = [[100,100],[150,100]]
    return (   
      <div className="App">
          {/* {this.returnRadioLang()}
          {this.returnBack()} */}
        <div className="App-header">
            {this.routesToStage()}
        </div>
      </div>
    )
  }
}

export default App;
