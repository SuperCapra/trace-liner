import logo from './logo.svg';
import './App.css';
import React from 'react';
const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET
const stravaAuthorizeUrl = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_STRAVA_AUTORIZE_DIRECTORY + 
  '?client_id=' + process.env.REACT_APP_STRAVA_CLIENT_ID + 
  '&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + 
  '/&response_type=code&scope=activity:read_all'

let called = false 
let athleteData = {}
let activities = []
let accessToken
let isLoading = false
let stage = 'RequestedLogin'
let stageHistory = ['RequestedLogin']
let stages = ['RequestedLogin','FetchingActivities','ShowingActivities','FetchingActivity','PersonalizingPhoto']

function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get('code')
  console.log('code:', code)
  if(code && !called) {
    called = true
    getAccessTokenAndActivities(code)
  }
  //checkParameters()
  return (
    <Homepage/>
  );
}

function getAccessTokenAndActivities(userCode) {
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
      if(accessToken) getActivities()
    })
    .catch(e => console.log('Fatal Error: ', JSON.parse(JSON.stringify(e))))
}

function getActivities() {
  console.log('getting all the activities...')
  let urlActivities = process.env.REACT_APP_STRAVA_HOST + process.env.REACT_APP_ACTIVITIES_DIRECTORY +
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
      //TODO solve the problem with the state and rendering the data when coming to strava
      // stage = ''
      console.log('activities: ', activities)
    })
}



class Homepage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      stage : stage,
      stageHistory : stageHistory
    }
  }
  
  loadingOrchestrator() {
    if(isLoading) {
      return (
        <p>IT'S LOADING</p>
      )
    } else {
      return (
        <button onClick={() => {
          window.location.href = stravaAuthorizeUrl
        }}>LOGIN TO STRAVA</button>
      )
    }
    // if(this.state.stage === 'LanguageSelection') {
    //   return (<LanguageSelection onClick={value => this.changeStage(value)}/>)
    // } else if(this.state.stage === 'FirstStep') {
    //   return (<FirstStep onInteractiveSelection={value => this.changeStage(value)}/>)
    // } else if(this.state.stage === 'Interactive') return (
    //   <Interactive/>
    // )
  }

  // returnRadioLang() {
  //   if(language) return (
  //     <RadioLang className="radio-lang" onChangeLanguage={value => this.changeStage(value)} onBack={() => this.goBack()}/>
  //   )
  //   return (<div></div>)
  // }

  // goBack() {
  //   console.log('stageHistory', stageHistory)
  //   stageHistory.pop()
  //   this.changeStage({stage: stageHistory[stageHistory.length - 1]})
  //   console.log('stageHistory', stageHistory)
  // }

  // returnBack() {
  //   if(stageHistory[stageHistory.length - 1] === 'Interactive') {
  //     return (<Back onBack={() => this.goBack()}/>)
  //   } else {
  //     return (<div></div>)
  //   }
  // }

  render() {
    return (   
      <div className="App">
          {/* {this.returnRadioLang()}
          {this.returnBack()} */}
        <div className="App-header">
          <div>
            {this.loadingOrchestrator()}
          </div>
        </div>
      </div>
    )
  }
}

// class LanguageSelection extends React.Component {
//   cycleLanguages() {
//     return(
//       <div>
//         {languages.map(x => {
//           return(
//             <div key={x.value} onClick={() => this.props.onClick({stage: 'FirstStep', language: x.value})} className="div-cliccable">
//               <p name={x.value}><code>{x.label}</code></p>
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   render() {
//     return(
//       <div>
//         {this.cycleLanguages()}
//       </div>
//     )
//   }
// }

export default App;
