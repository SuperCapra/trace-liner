import './App.css';
import React, {useState} from 'react';
import utils from './utils.js'
import Loader from './Loader.js'
import ImageComponent from './ImageComponent.js'
import {ReactComponent as ArrowDown} from './arrowDownSimplified.svg'
import brandingPalette from './brandingPalette';
import GPXParser from 'gpxparser';

let stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&response_type=code&scope=activity:read_all' +
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI

let unitMeasure = 'metric'
let called = false 

let athleteData = {}
let activities = []
let activity = {}
let accessToken
let isLoading = false
let stage = 'RequestedLogin'
let stageHistory = ['ShowingActivity']
let stages = ['RequestedLogin','FetchingActivities','ShowingActivities','FetchingActivity','PersonalizingPhoto','ShowingActivity']

function App() {
  const [displayStyle, setDisplayStyle] = useState({  
    display: 'block',
    rotate: '0deg',
    transition: 'rotate 1s',
  })

  const changeDisplayStyle = (sty) => {
    setDisplayStyle(sty)
  }

  return (
    <div>
      <Homepage displayStyle={displayStyle} onChangeDisplayStyle={changeDisplayStyle} />
    </div>
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

  loadGPX() {
    const gpxInput = document.getElementById('gpxInput')
    if(gpxInput) gpxInput.click()
  }

  processGPX(event) {
    if(event && event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        let gpxFile = e.target.result
        const gpx = new GPXParser()
        gpx.parse(gpxFile)
        const tracks = gpx.tracks.map(track => ({
          name: track.name,
          segments: track.points.map(segment => ({
            lat: segment.lat,
            lon: segment.lon,
            ele: segment.ele,
            time: segment.time,
          }))
        }))
        console.log('tracks: ', tracks)
      };
      reader.readAsText(file);
    }
  }

  routesToStage() {
    isLoading = false
    let queryParameters = new URLSearchParams(window.location.search)
    let urlCurrent = window.location.href
    console.log('window.location', window.location.href)
    let code = queryParameters.get('code')
    let clubName = (urlCurrent.includes('/nama-crew')) ? 'nama-crew' : undefined
    if(urlCurrent.includes('/nama-crew') && !stravaAuthorizeUrl.includes('/nama-crew')) {
      console.log('clubName: ', clubName)
      stravaAuthorizeUrl += '/' + clubName
    }
    if(code && !called) {
      called = true
      this.getAccessTokenAndActivities(code)
    }
    if(isLoading || this.state.stage === 'FetchingActivities' || this.state.stage === 'FetchingActivity') {
      return (
        <div className="translate-y">
          <Loader/>
        </div>
      )
    } else {
      if(this.state.stage === 'RequestedLogin') {
        return (
          <div className="translate-y">
            <div className="button-login justify-center-column" onClick={() => {
              window.location.href = stravaAuthorizeUrl
            }}><p className="p-login p-login-or-size">LOGIN TO STRAVA</p></div>
            <div className="margin-or">
              <p className="p-or p-login-or-size">OR</p>
            </div>
            <div className="button-login justify-center-column" onClick={() => this.loadGPX()}>
              <p className="p-login p-login-or-size">LOAD A GPX</p>
              <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} onChange={this.processGPX} />
            </div>
          </div>
        )
      } else if(this.state.stage === 'ShowingActivities') {
        console.log(activities)
        let arrowDownStyle = {
          fill: brandingPalette.background
        }
        let activitiesButton = activities.map(element => 
          <div key={element.id} className="button-activity justify-center-column" onClick={() => {
              this.getActivity(element.id)
            }}>
            <p className="title-activity">{element.name}</p>
            <p className="subtitle-activity">{element[element.unitMeasure].subtitle}</p>
          </div>)
        let styleSelectActivity = {
          display: activitiesButton.length ? 'block' : 'none'
        }
        let styleArrow = !activitiesButton.length ? { display : 'none' } : this.props.displayStyle
        return (
          <div>
            <div style={styleSelectActivity}>
              <p className="p-select">SELECT AN ACTIVITY</p>
            </div>
            {activitiesButton.length > 0 && activitiesButton}
            {(activitiesButton.length === 0 || !activitiesButton.length) && (
              <div>
                <p className="p-select">BEFORE YOU CAN START YOU HAVE TO LOAD SOME ACTIVITIES</p>
              </div>
            )}
            <div className="arrow-down" style={styleArrow} onClick={() => this.scroll()}>
              <ArrowDown style={arrowDownStyle}/>
            </div>
          </div>
        )
      } else if(this.state.stage === 'ShowingActivity') {
        return (
          <div>
              <ImageComponent activity={activity} clubname={clubName} handleBack={() => this.changeStage({stage:'ShowingActivities'})}/>
          </div>
        )
      }
    }
  }

  scroll() {
    window.scrollTo({
      top: (window.innerHeight + window.scrollY >= document.body.scrollHeight) ? 0 : document.body.scrollHeight,
      behavior: 'smooth'
    });
    this.props.onChangeDisplayStyle({
      display: document.body.scrollHeight > window.innerHeight ? 'block' : 'none',
      rotate: (window.innerHeight + window.scrollY >= document.body.scrollHeight ? 0 : 180) + 'deg',
      transition: 'rotate 1s',
    })
  }

  getAccessTokenAndActivities(userCode) {
    isLoading = true
    console.log('getting the access token...')
    let urlAccessToken = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_TOKEN_DIRECTORY +
      '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
      '&client_secret=' + process.env.REACT_APP_STRAVA_CLIENT_SECRET + 
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
        if(res && res.errors && res.errors.length) {
          window.history.pushState({}, document.title, window.location.pathname);
          window.location.reload();
        }
        accessToken = res.access_token
        athleteData = res.athlete
        console.log('athleteData: ', athleteData)
        if(accessToken) this.getActivities()
        // if(accessToken) this.getAthleDataComplete()
      })
      .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
  }

  getAthleDataComplete() {
    console.log('getting all the athlete data...')
    let urlAthleteData = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_ATHLETE_DIRECTORY +
    '?access_token=' + accessToken

    fetch(urlAthleteData, {
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
          console.log('Athlete data: ', res)
          unitMeasure = !res.measurement_preference || res.measurement_preference === 'meters' ? 'meter' : 'imperial'
          this.getActivities()
        }
      })
      .catch(e => console.log('Fatal Error: ', e))
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
              average: utils.getAverageSpeedMetric(e.distance, e.moving_time),
              altitudeStream: [],
              metric: {
                beautyAverage: utils.getAverageSpeedMetric(e.distance, e.moving_time) + 'km/h',
                beautyElevation: e.total_elevation_gain + 'm',
                beautyDistance: (e.distance / 1000).toFixed(0) + 'km',
                distance: Number((e.distance / 1000).toFixed(0)),
              },
              imperial: {
                beautyAverage: utils.getAverageSpeedImperial(e.distance, e.moving_time) + 'mi/h',
                beautyElevation: (e.total_elevation_gain * 3.28084).toFixed(0) + 'ft',
                beautyDistance: ((e.distance / 1000) * 0.621371).toFixed(0) + 'mi',
                distance: Number(((e.distance / 1000) * 0.621371).toFixed(0)),
              },
              beautyCoordinates: undefined,
              beautyEndCoordinates: undefined,
              beautyDuration: utils.getBeautyDuration(e.moving_time),
              beautyName: e.name,
              beautyPower: e.average_watts ? (e.average_watts + 'W') : undefined,
              beautyDate: utils.getBeautyDatetime(e.start_date_local),
              durationMoving: e.moving_time,
              durationElapsed: e.elapsed_time,
              endLatitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[0] : undefined,
              endLongitude: e.end_latlng && e.end_latlng.length && e.end_latlng.length === 2 ? e.end_latlng[1] : undefined,
              distance: e.distance,
              distanceStream: [],
              elevation: e.total_elevation_gain,
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
              startLongitude: e.start_latlng && e.start_latlng.length && e.start_latlng.length === 2 ? e.start_latlng[1] : undefined,
              unitMeasure: unitMeasure,
              hasAltitudeStream: false,
              hasCoordinates: false
            }
            t.beautyCoordinatesComplete = utils.getBeautyCoordinates([t.startLatitude, t.startLongitude])
            t.beautyCoordinates = t.beautyCoordinatesComplete.beautyCoordinatesTextTime
            t.beautyEndCoordinatesComplete = utils.getBeautyCoordinates([t.endLatitude, t.endLongitude])
            t.beautyEndCoordinates = t.beautyEndCoordinatesComplete.beautyCoordinatesTextTime
            t.metric.subtitle = utils.getSubTitle(t, 'metric')
            // t.metric.beautyData = t.metric.beautyDistance + ' x ' + t.metric.beautyElevation + ' x ' + t.beautyDuration
            t.imperial.subtitle = utils.getSubTitle(t, 'imperial')
            // t.imperial.beautyData = t.imperial.beautyDistance + ' x ' + t.imperial.beautyElevation + ' x ' + t.beautyDuration
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
    let indexActivity = activities.findIndex(x => x.id === activityId)
    isLoading = true
    this.changeStage({stage:'FetchingActivity'})
    console.log('getting activityId: ', activityId)
    if(activities[indexActivity].hasCoordinates && activities[indexActivity].hasAltitudeStream) {
      isLoading = false
      this.changeStage({stage:'ShowingActivity'})
    } else if(activities[indexActivity].hasCoordinates && !activities[indexActivity].hasAltitudeStream) {
      this.getAltitideStream(activityId, indexActivity)
    }
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
          activities[indexActivity].coordinates = utils.polylineToGeoJSON(res.map.polyline)
          activities[indexActivity].polyline = res.map.polyline
          activities[indexActivity].hasCoordinates = activities[indexActivity].coordinates && activities[indexActivity].coordinates.length
          activity = activities[indexActivity]
          activity.photoUrl = res?.photos?.primary?.urls['600']
          console.log(activity)
          // this.getImage(activity.photoUrl)
        }
      })
      .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
      .finally(() => {
        // isLoading = false
        this.getAltitideStream(activityId, indexActivity)
      })
  }

  getAltitideStream(activityId, indexActivity) {
    console.log('getting the altitude stream')
    let urlStreamsAltitude = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STREAMS_DIRECTORY.replace('{id}',activityId) +
      '?access_token=' + accessToken +
      '&keys=altitude&key_by_type=true'
  
    fetch(urlStreamsAltitude, {
      method: 'GET',
    }).then(response => response.json())
      .then(res => {
        console.log('Result altitude stream: ', res)
        activities[indexActivity].altitudeStream = res.altitude.data
        activities[indexActivity].distanceStream = res.distance.data
        activities[indexActivity].hasAltitudeStream = activities[indexActivity].altitudeStream && activities[indexActivity].altitudeStream.length
      })
      .catch(e => console.log('Fatal Error: ', e))
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
