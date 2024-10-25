import './App.css';
import React, {useState} from 'react';
import utils from './utils.js'
import Loader from './Loader.js'
import ImageComponent from './ImageComponent.js'
import Creator from './Creator.js'
// import Dropdown from './Dropdown.js'
import {ReactComponent as ArrowDown} from './images/arrowDownSimplified.svg'
import {ReactComponent as ArrowLeft} from './images/arrowLeftSimplified20.svg'
import brandingPalette from './brandingPalette';
import {vocabulary, languages} from './vocabulary';
import clubs from './clubs'
import GPXParser from 'gpxparser';
import he from 'he';
import saleforceApiUtils from './api/salesforce.js';

let stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&response_type=code&scope=activity:read_all' +
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI

let unitMeasure = 'metric'
let called = false 
let changedLanguage = false
let admin = false

let athleteData = {}
let activities = []
let activity = {}
let accessToken
let isLoading = false
let isAutoScrolling = false
let stage = 'RequestedLogin'
let stageHistory = ['ShowingActivity']
let stages = ['RequestedLogin','FetchingActivities','ShowingActivities','FetchingActivity','PersonalizingPhoto','ShowingActivity']

function App() {
  const [displayStyle, setDisplayStyle] = useState({  
    display: 'block',
    rotate: '0deg',
    transition: 'rotate 1s',
  })
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  // const [selectedLanguage, setSelectedLanguage] = useState((languages && languages.length && navigator && navigator.language && navigator.language.length >= 2 && languages.findIndex(x => x === navigator.language.substring(0,2).toLowerCase()) > -1 ? navigator.language.substring(0,2).toLowerCase() : 'en'))

  const changeLanguage = (language) => {
    setSelectedLanguage(language)
  }

  const changeDisplayStyle = (sty) => {
    setDisplayStyle(sty)
  }
  const handleScroll = () => {
    if(!isAutoScrolling && (window.scrollY < document.body.scrollHeight * 0.1 || window.scrollY + window.innerHeight > document.body.scrollHeight * 0.9)) {
      if(window.scrollY < document.body.scrollHeight * 0.1 && displayStyle.rotate === '180deg') {
        setDisplayStyle({
          display: 'block',
          rotate: '0deg',
          transition: 'rotate 1s',
        })
      }
      if(window.scrollY + window.innerHeight > document.body.scrollHeight * 0.9 && displayStyle.rotate === '0deg') {
        setDisplayStyle({
          display: 'block',
          rotate: '180deg',
          transition: 'rotate 1s',
        })
      }
    } else if(isAutoScrolling && (window.scrollY === 0 || window.scrollY === document.body.scrollHeight)) isAutoScrolling = false
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <div>
      <Homepage displayStyle={displayStyle} onChangeDisplayStyle={changeDisplayStyle} language={selectedLanguage} changeLanguage={changeLanguage}/>
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
    this.processGPX = this.processGPX.bind(this);
    this.changeStage = this.changeStage.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
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
        console.log('gpx.metadata.time: ', gpx.metadata.time)
        let dateTimeLocalStringified = gpx && gpx.tracks && gpx.tracks.length && gpx.tracks[0].points && gpx.tracks[0].points.length && gpx.tracks[0].points[0].time ? utils.returnDatetimeStringified(gpx.tracks[0].points[0].time) + 'T' + gpx.tracks[0].points[0].time.toLocaleTimeString() : undefined
        let dateTimeStringified = gpx && gpx.metadata && gpx.metadata.time ? gpx.metadata.time : undefined
        console.log('gpx:', gpx)
        console.log('unix time stamp in seconds', Math.floor(gpx.tracks[0].points[0].time)/1000)
        const tracks = gpx.tracks.map(track => ({
          average: undefined,
          altitudeStream: [...track.points.map(point => (point.ele))],
          metric: {
            beautyAverage: undefined,
            beautyElevation: track.elevation && track.elevation.pos ? (track.elevation.pos).toFixed(0) + 'm' : undefined,
            beautyDistance: track.distance && track.distance.total ? (track.distance.total / 1000).toFixed(0) + 'km' : undefined,
            distance: track.distance && track.distance.total ? Number((track.distance.total / 1000).toFixed(0)) : undefined,
            subtitle: undefined
          },
          imperial: {
            beautyAverage: undefined,
            beautyElevation: track.elevation && track.elevation.pos ? (track.elevation.pos * 3.28084).toFixed(0) + 'ft' : undefined,
            beautyDistance: track.distance && track.distance.total ? ((track.distance.total / 1000) * 0.621371).toFixed(0) + 'mi' : undefined,
            distance: track.distance && track.distance.total ? Number(((track.distance.total / 1000) * 0.621371).toFixed(0)) : undefined,
            subtitle: undefined
          },
          beautyCoordinates: undefined,
          beautyEndCoordinates: undefined,
          beautyDuration: undefined,
          beautyName: track.name ? he.decode(track.name) : undefined,
          beautyPower: undefined,
          // beautyDate: dateTimeLocalStringified ? utils.getBeautyDatetime(dateTimeLocalStringified) : undefined,
          beautyDatetimeLanguages: dateTimeLocalStringified ? utils.getBeautyDatetime(dateTimeLocalStringified) : undefined,
          coordinates: track.points && track.points.length ? track.points.map(point => ([
            point.lon,
            point.lat
          ])) : undefined,
          durationMoving: undefined,
          durationElapsed: undefined,
          endLatitude: undefined,
          endLongitude: undefined,
          distance: track.distance && track.distance.total ? track.distance.total : undefined,
          distanceStream: track.distance && track.distance.cumul.length ? [...track.distance.cumul] : undefined,
          elevation: track.elevation && track.elevation.pos ? track.elevation.pos : undefined,
          locationCountry: undefined,
          movingTime: undefined,
          timingStreamSeconds: track.points && track.points.length ? [...track.points.map(point => (Math.floor(point.time) / 1000))] : undefined,
          name: track.name ? he.decode(track.name) : undefined,
          photoUrl: undefined,
          sportType: undefined,
          startDate: dateTimeStringified,
          startDateLocal: dateTimeLocalStringified,
          startLatitude: undefined,
          startLongitude: undefined,
          unitMeasure: unitMeasure,
          hasAltitudeStream: false,
          hasCoordinates: false,
          fromGpx: true,
        }))
        let activityPreparing = tracks[0]
        activityPreparing.movingTime = activityPreparing.coordinates && activityPreparing.coordinates.length ? activityPreparing.coordinates.length : undefined
        activityPreparing.durationMoving = activityPreparing.movingTime
        activityPreparing.durationElapsed = activityPreparing.timingStreamSeconds && activityPreparing.timingStreamSeconds.length ? activityPreparing.timingStreamSeconds[activityPreparing.timingStreamSeconds.length - 1] - activityPreparing.timingStreamSeconds[0] : undefined
        activityPreparing.metric.beautyAverage = utils.getAverageSpeedMetric(activityPreparing.distance, activityPreparing.movingTime) + 'km/h'
        activityPreparing.average = activityPreparing.metric.beautyAverage
        activityPreparing.imperial.beautyAverage = utils.getAverageSpeedImperial(activityPreparing.distance, activityPreparing.movingTime) + 'mi/h'
        activityPreparing.endLatitude = activityPreparing.coordinates && activityPreparing.coordinates.length && activityPreparing.coordinates[activityPreparing.coordinates.length - 1].length ? activityPreparing.coordinates[activityPreparing.coordinates.length - 1][0] : undefined
        activityPreparing.endLongitude = activityPreparing.coordinates && activityPreparing.coordinates.length && activityPreparing.coordinates[activityPreparing.coordinates.length - 1].length ? activityPreparing.coordinates[activityPreparing.coordinates.length - 1][1] : undefined
        activityPreparing.startLatitude = activityPreparing.coordinates && activityPreparing.coordinates.length && activityPreparing.coordinates[0].length ? activityPreparing.coordinates[0][0] : undefined
        activityPreparing.startLongitude = activityPreparing.coordinates && activityPreparing.coordinates.length && activityPreparing.coordinates[0].length ? activityPreparing.coordinates[0][1] : undefined
        activityPreparing.beautyCoordinatesComplete = utils.getBeautyCoordinates([activityPreparing.startLatitude, activityPreparing.startLongitude])
        activityPreparing.beautyCoordinates = activityPreparing.beautyCoordinatesComplete.beautyCoordinatesTextTime
        activityPreparing.beautyEndCoordinatesComplete = utils.getBeautyCoordinates([activityPreparing.endLatitude, activityPreparing.endLongitude])
        activityPreparing.beautyEndCoordinates = activityPreparing.beautyEndCoordinatesComplete.beautyCoordinatesTextTime
        activityPreparing.beautyDuration = utils.getBeautyDuration(activityPreparing.movingTime)
        console.log('activityPreparing ', activityPreparing)
        activity = activityPreparing
        this.changeStage({stage: 'ShowingActivity'})
      }
      reader.readAsText(file);
    }
  }

  setLanguage(data) {
    this.props.changeLanguage(data.value)
  }

  routesToStage() {    
    // let localKey = localStorage.getItem('tracelinerkey');
    // if(localKey && !accessToken) {
    //   accessToken = localKey
    //   console.log('localKey:', localKey)
    //   this.getActivities()
    // }
    // window.alert(window.innerHeight + ' and ' + window.clientHeight)
    console.info('Language navigator:', navigator.language)
    console.info('Language:', this.props.language)
    console.log('clubs', clubs)
    console.log('window.location.hostname:', window.location.pathname)
    isLoading = false
    let queryParameters = new URLSearchParams(window.location.search)
    let urlCurrent = window.location.href
    admin = urlCurrent.includes('/admin')
    if(admin) stravaAuthorizeUrl += '/admin'
    console.log('window.location', window.location.href)
    let code = queryParameters.get('code')
    let club
    let language = this.props.language
    for(let c of clubs) {
      if(urlCurrent.includes(c.urlKey)) {
        club = c
        break
      }
    }
    if(club && urlCurrent.includes(club.urlKey) && !stravaAuthorizeUrl.includes(club.urlKey)) {
      console.info('Club: ', club)
      stravaAuthorizeUrl += club.urlKey
    }

    if(urlCurrent.includes('/gpx-file')) {
      this.changeStage({stage: 'ShowingActivity'})
    }
    if(code && !called) {
      // queryParameters.forEach((value, key) => {
      //   queryParameters.delete(key)
      //   console.log(key, value);
      // });
      called = true
      this.getAccessTokenAndActivities(code)
      if(!changedLanguage && club && club.language && languages.includes(club.language)) language = club.language
    } else if(club && club.language && languages.includes(club.language) && !changedLanguage) {
      this.setLanguage({value: club.language})
    }
    let mainWrapperClasses = "main-wrapper" + (utils.isMobile() ? " translate-main-wapper-mobile" :  " translate-main-wapper-desktop")
    if(isLoading || this.state.stage === 'FetchingActivities' || this.state.stage === 'FetchingActivity') {
      return (
        <div className={mainWrapperClasses}>
          <Loader/>
        </div>
      )
    } else {
      if(this.state.stage === 'RequestedLogin') {
        let urlWithoutParams = window.location.pathname
        if(urlCurrent !== urlWithoutParams && !urlCurrent.includes('192.168.1.69')) window.history.replaceState({}, '', urlWithoutParams);
        return (
          <div className="quadratic-wrapper">
            {/* <div className="buttons-wrapper">
              <div className="language-selector-alone">
                <Dropdown value={this.props.language} values={languages} handleChangeValue={this.setLanguage}/>
              </div>
            </div> */}
            <div className={mainWrapperClasses}>
              <div className="margin-title">
                <p className="p-or p-login-or-size">{vocabulary[this.props.language].HOMEPAGE_SHARE_BY}</p>
              </div>
              <div className="button-login justify-center-column" onClick={() => {
                window.location.href = stravaAuthorizeUrl
              }}><p className="p-login p-login-or-size">{vocabulary[this.props.language].HOMEPAGE_LOGIN_STRAVA}</p></div>
              <div className="margin-or">
                <p className="p-or p-login-or-size">{vocabulary[this.props.language].HOMEPAGE_OR}</p>
              </div>
              <div className="button-login justify-center-column" onClick={() => this.loadGPX()}>
                <p className="p-login p-login-or-size">{vocabulary[this.props.language].HOMEPAGE_LOAD}</p>
                <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} onChange={this.processGPX} />
              </div>
              {club && club.hasHomepageLogo && club.homepageLogo(vocabulary, this.props.language)}
            </div>
            <div className="creator-justify-center">
              <Creator language={this.props.language} classes="creator creator-homepage"/>
            </div>
          </div>
        )
      } else if(this.state.stage === 'ShowingActivities') {
        console.log('Activities: ', activities)
        let arrowDownStyle = {
          fill: brandingPalette.background
        }
        let activitiesButton = activities.map(element => 
          <div key={element.id} className="button-activity justify-center-column" onClick={() => {
              this.getActivity(element.id)
            }}>
            <p className="title-activity">{element.name}</p>
            <p className="subtitle-activity">{element[element.unitMeasure].subtitle[this.props.language]}</p>
          </div>)
        let styleSelectActivity = {
          display: activitiesButton.length ? 'block' : 'none'
        }
        let styleArrow = !activitiesButton.length ? { display : 'none' } : this.props.displayStyle
        return (
          <div>
            <div className="header-wrapper">
              <div className="back-button" onClick={() => this.changeStage({stage:'RequestedLogin'})}>
                <div className="back-arrow-container">
                  <ArrowLeft className="back-image"/>
                </div>
                <div className="back-text-container">
                  <p className="p-back">{vocabulary[this.props.language].HOMEPAGE_BACK}</p>
                </div>
              </div>
              <div className="language-selector">
                {/* <Dropdown value={this.props.language} values={languages} handleChangeValue={this.setLanguage}/> */}
              </div>
            </div>
            <div style={styleSelectActivity}>
              <p className="p-select">{vocabulary[this.props.language].HOMEPAGE_SELECT_ACTIVITY}</p>
            </div>
            {activitiesButton.length > 0 && activitiesButton}
            {(activitiesButton.length === 0 || !activitiesButton.length) && (
              <div>
                <p className="p-select">{vocabulary[this.props.language].HOMEPAGE_BEFORE_START}</p>
              </div>
            )}
            <Creator language={this.props.language} classes="creator"/>
            <div className="arrow-down" style={styleArrow} onClick={() => this.scroll()}>
              <ArrowDown style={arrowDownStyle}/>
            </div>
          </div>
        )
      } else if(this.state.stage === 'ShowingActivity') {
        return (
          <div>
            <div className="image-creator">
              <div className="image-creator-wrapper-1">
                <ImageComponent athlete={athleteData} activity={activity} club={club} admin={admin} language={language} handleBack={() => this.changeStage({stage: ((activity && activity.fromGpx) ? 'RequestedLogin' : 'ShowingActivities')})} handleBubbleLanguage={this.setLanguage}/>
              </div>
              <div className="image-creator-wrapper-2">
                <Creator language={this.props.language} classes="creator creator-800"/>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  scroll() {
    isAutoScrolling = true
    window.scrollTo({
      top: (window.innerHeight + window.scrollY + 50 >= document.body.scrollHeight) ? 0 : document.body.scrollHeight,
      behavior: 'smooth'
    });
    this.props.onChangeDisplayStyle({
      display: document.body.scrollHeight > window.innerHeight ? 'block' : 'none',
      rotate: (window.innerHeight + window.scrollY + 50 >= document.body.scrollHeight ? 0 : 180) + 'deg',
      transition: 'rotate 1s',
    })
  }

  getAccessTokenAndActivities(userCode) {
    isLoading = true
    console.info('getting the access token...')
    let urlToken = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_TOKEN_DIRECTORY +
      '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
      '&client_secret=' + process.env.REACT_APP_STRAVA_CLIENT_SECRET + 
      '&code=' + userCode +
      '&grant_type=authorization_code'
  
    fetch(urlToken, {
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
        let refreshToken = res.refresh_token
        console.log('Strava User Id:', process.env.REACT_APP_STRAVA_USER_ID)
        console.log('is equal?', String(athleteData.id) === process.env.REACT_APP_STRAVA_USER_ID)
        if(String(athleteData.id) === process.env.REACT_APP_STRAVA_USER_ID) {
          try {
            saleforceApiUtils.storeRefreshToken(process.env,athleteData.id,utils.getName(athleteData.firstname,athleteData.lastname),refreshToken)
          } catch (e) {
            console.error(e)
          }
        }
        localStorage.setItem('tracelinerkey',accessToken);
        console.log('athleteData: ', athleteData)
        if(accessToken) this.getActivities()
        // if(accessToken) this.getAthleDataComplete()
      })
      .catch(e => console.error('Fatal Error: ', JSON.parse(JSON.stringify(e))))
  }

  getAthleDataComplete() {
    console.info('getting all the athlete data...')
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
        if(res) {
          console.log('Athlete data: ', res)
          unitMeasure = !res.measurement_preference || res.measurement_preference === 'meters' ? 'meter' : 'imperial'
          this.getActivities()
        }
      })
      .catch(e => console.error('Fatal Error: ', e))
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
        console.info('Row activities: ', res)
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
              // beautyDate: utils.getBeautyDatetime(e.start_date_local),
              beautyDatetimeLanguages: utils.getBeautyDatetime(e.start_date_local),
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
      .catch(e => console.error('Fatal Error: ', e))
      .finally(() => {
        isLoading = false
        this.changeStage({stage:'ShowingActivities'})
        console.info('Activities: ', activities)
      })
  }

  getActivity(activityId) {
    let indexActivity = activities.findIndex(x => x.id === activityId)
    isLoading = true
    this.changeStage({stage:'FetchingActivity'})
    console.info('getting activity with id: ', activityId)
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
        console.log('Complete raw activity: ', res)
        if(res) {
          activities[indexActivity].coordinates = utils.polylineToGeoJSON(res.map.polyline)
          activities[indexActivity].polyline = res.map.polyline
          activities[indexActivity].hasCoordinates = activities[indexActivity].coordinates && activities[indexActivity].coordinates.length ? true : false
          activity = activities[indexActivity]
          activity.photoUrl = res?.photos?.primary?.urls['600']
          console.log(activity)
          // this.getImage(activity.photoUrl)
        }
      })
      .catch(e => console.error('Fatal Error: ', JSON.parse(JSON.stringify(e))))
      .finally(() => {
        // isLoading = false
        this.getAltitideStream(activityId, indexActivity)
      })
  }

  getAltitideStream(activityId, indexActivity) {
    console.info('getting the altitude stream...')
    let urlStreamsAltitude = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STREAMS_DIRECTORY.replace('{id}',activityId) +
      '?access_token=' + accessToken +
      '&keys=altitude&key_by_type=true'
  
    fetch(urlStreamsAltitude, {
      method: 'GET',
    }).then(response => response.json())
      .then(res => {
        console.info('Result altitude stream: ', res)
        activities[indexActivity].altitudeStream = res.altitude.data
        activities[indexActivity].distanceStream = res.distance.data
        activities[indexActivity].hasAltitudeStream = activities[indexActivity].altitudeStream && activities[indexActivity].altitudeStream.length ? true : false
      })
      .catch(e => console.error('Fatal Error: ', e))
      .finally(() => {
        isLoading = false
        this.changeStage({stage:'ShowingActivity'})
        console.log('activity: ', activity)
      })
  }

  render() {
    return (   
      <div className="App">
        <div className="App-body">
          {this.routesToStage()}
        </div>
      </div>
    )
  }
}

export default App;
