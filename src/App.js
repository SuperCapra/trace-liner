import './App.css';
import React from 'react';
import utils from './utils.js'
import Loader from './Loader.js'
// import ButtonImage from './ButtonImage.js'
import ImageComponent from './ImageComponent.js'
import imageDefault from './image2.jpeg'
const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET
const stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + 
  '/&response_type=code&scope=activity:read_all'

// const image = new Image()

let called = false 
let athleteData = {}
let activities = []
let activity = {}
let accessToken
let isLoading = false
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
      stageHistory : stageHistory,
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

  routesToStage() {
    isLoading = false
    let queryParameters = new URLSearchParams(window.location.search)
    let code = queryParameters.get('code')
    activity.coordinates = [[100,100],[150,100]]
    activity.beautyName = 'ciccio pasticcio il pusillanime che porta con se un pollo sotto il braccios'
    activity.beautyDuration = '4h 36m'
    activity.beautyDate = 'March 31, 19:37'
    activity.beautyDistance = '123.34km'
    activity.beautyPower = '203W'
    activity.beautyCoordinates = utils.getBeautyCoordinates([45.15,10.2]).beautyCoordinatesTextTime
    activity.beautyCoordinatesComplete = utils.getBeautyCoordinates([45.15,10.2])
    activity.beautyAverage = '27.56km/h'
    activity.beautyElevation = '3290m'
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
        return (
          <div>
              <ImageComponent activity={activity} image={imageDefault}/>
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
              average: e.average_speed,
              beautyAverage: e.average_speed + 'km/h',
              beautyCoordinates: undefined,
              beautyEndCoordinates: undefined,
              beautyElevation: e.total_elevation + 'm',
              beautyDistance: (e.distance / 1000).toFixed(2) + 'km',
              beautyDuration: utils.getBeautyDuration(e.elapsed_time),
              beautyName: utils.removeEmoji(e.name),
              beautyPower: e.average_watts + 'W',
              beautyStartDate: utils.getBeautyDatetime(e.start_date),
              distance: e.distance,
              distanceKm: Number((e.distance / 1000).toFixed(2)),
              duration: e.elapsed_time,
              endLatitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[0] : undefined,
              endLongitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[1] : undefined,
              elevation: e.total_elevation,
              id: e.id,
              locationCountry: e.location_country,
              movingTime: e.moving_time,
              name: e.name,
              power: e.average_watts,
              photoUrl: undefined,
              sportType: utils.labelize(e.sport_type),
              startDate: e.start_date,
              startDateLocal: e.start_date_local,
              startLatitude: e.start_latlng && e.start_latlng.length && e.start_latlng.length === 2 ? e.start_latlng[0] : undefined,
              startLongitude: e.start_latlng && e.start_latlng.length && e.start_latlng.length === 2 ? e.start_latlng[1] : undefined
            }
            t.beautyCoordinatesComplete = utils.getBeautyCoordinates(t.startLatitude, t.startLongitude)
            t.beautyCoordinates = t.beautyCoordinatesComplete.beautyCoordinatesTextTime
            t.beautyEndCoordinatesComplete = utils.getBeautyCoordinates(t.endLatitude, t.endLongitude)
            t.beautyCoordinates = t.beautyEndCoordinatesComplete.beautyCoordinatesTextTime
            t.subtitle = t.beautyStartDate + ' | ' + t.sportType + ' | ' + t.distanceKm + ' | ' + t.beautyDuration
            activities.push(t)
          })
        }
      })
      .catch(e => console.log('Fatal Error: ', e))
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
          activity.photoUrl = res?.photos?.primary?.urls['600']
          console.log(activity)
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
