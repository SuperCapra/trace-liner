import logo from './logo.svg';
import stravaLogo from './strava-logo.png';
import './App.css';
import React, { useState } from 'react';
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
      console.log('it come here')
      return (
        <p>IT'S LOADING</p>
      )
    } else {
      if(this.state.stage === 'RequestedLogin') {
        console.log('it come RequestedLogin')
        return (
          // <div className="button-activity">
          //   <p className="title-activity">IWD</p>
          //   <p className="subtitle-activity">Ride | 123km | 2h 36m | 9 march 2024</p>
          // </div>
          <div className="button-login" onClick={() => {
            window.location.href = stravaAuthorizeUrl
          }}><p className="p-login">LOGIN TO STRAVA</p></div>
        )
      } else if(this.state.stage === 'FetchingActivities') {
        console.log('it come FetchingActivities')
        return (
          <p>FetchingActivities</p>
        )
      } else if(this.state.stage === 'ShowingActivities') {
        let activitiesButton = activities.map(element => <div key={element.id}><button onClick={() => this.getActivity(element.id)}>{element.name}</button></div>)
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
            activities.push({
              name: e.name,
              id: e.id
            })
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
