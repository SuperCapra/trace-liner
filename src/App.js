import './App.css';
import React from 'react';
import utils from './utils.js'
import Loader from './Loader.js'
const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET
const stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + 
  '/&response_type=code&scope=activity:read_all'

let called = false 
let athleteData = {}
let activities = []
let activity = {}
let accessToken
let isLoading = false
let stage = 'RequestedLogin'
let stageHistory = ['RequestedLogin']
let stages = ['RequestedLogin','FetchingActivities','ShowingActivities','FetchingActivity','PersonalizingPhoto','ShowingActivity']

function App() {
  return (
    <Homepage/>
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
    // console.log('handleClick: ', value)
    if(value.stage) {
      stage = value.stage
      if(value.stage === stages[0]) {
        stageHistory = [stages[0]]
      } else if(stageHistory[stageHistory.length - 1] !== value.stage) {
        stageHistory.push(value.stage)
        // if(value.stage === 'Interactive') this.returnRadioLang()
      }
    }
    console.log('stageHistory', stageHistory)
    this.setState({
      stage : stage,
      stageHistory : stageHistory
    })
  }

  routesToStage() {
    console.log('routesToStage')
    let queryParameters = new URLSearchParams(window.location.search)
    let code = queryParameters.get('code')
    console.log('code:', code)
    if(code && !called) {
      called = true
      this.getAccessTokenAndActivities(code)
    }
    console.log('isLoading: ', isLoading)
    console.log('this.state.stage: ', this.state.stage)
    if(isLoading) {
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
      } else if(this.state.stage === 'FetchingActivities') {
        return (
          <p>FetchingActivities</p>
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
        return (
          <p>ShowingActivity</p>
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

  draw(coodinates) {
    let width = 500
    let height = 500
    let border = 20
    const canvas = this.template.querySelector('.canvas');

    if(!canvas || !canvas.getContext) return

    let minX = Math.min(...coodinates.map(x => x[0]))
    let maxX = Math.max(...coodinates.map(x => x[0]))
    let minY = Math.min(...coodinates.map(x => x[1]))
    let maxY = Math.max(...coodinates.map(x => x[1]))

    console.log('minX:', minX)
    console.log('maxX:', maxX)
    console.log('minY:', minY)
    console.log('maxY:', maxY)
    
    let mapWidth = maxX - minX
    let mapHeight = maxY - minY
    let mapCenterX = (minX + maxX) / 2
    let mapCenterY = (minY + maxY) / 2

    console.log('mapWidth:', mapWidth)
    console.log('mapHeight:', mapHeight)

    let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)

    console.log('mapWidth*zoomFactor:', mapWidth*zoomFactor)
    console.log('mapHeight*zoomFactor:', mapHeight*zoomFactor)

    const ctx = canvas.getContext('2d')

    // set line stroke and line width
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 4

    ctx.beginPath()

    for(let i = 0; i < coodinates.length; i++) {
      let c = coodinates[i]
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
    }

    ctx.stroke()
    this.changeStage({stage:'ShowingActivity'})
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
          activity = res
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
