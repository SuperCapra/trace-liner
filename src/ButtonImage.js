import './App.css';
import React, {useState} from 'react';
import {ReactComponent as ShareSVG} from './share.svg'
import {ReactComponent as ModifySVG} from './modify.svg'
import {ReactComponent as TextSVG} from './text.svg'
import {ReactComponent as RectangleSVG} from './rectangle.svg'
import {ReactComponent as SquareSVG} from './square.svg'
import {ReactComponent as ViewSVG} from './view.svg'
import {ReactComponent as HideSVG} from './hide.svg'
import brandingPalette from './brandingPalette';

function ButtonImage(props) {

  const { activity, handleClickButton } = props

  const [showModifyImage, setModifyImgae] = useState(false);
  const [showModifyText, setModifyText] = useState(false);
  const [square, setSquare] = useState(false);
  const [rectangle, setRectangle] = useState(true);
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const colors = []

  const showModifySetImage = () => {
    setModifyText(false)
    setModifyImgae(!showModifyImage)
  }
  const showModifySetText = () => {
    setModifyImgae(false)
    setModifyText(!showModifyText)
  }
  const handleClick = (data) => {
    handleClickButton(data)
  }
  const propagateSquare = () => {
    if(rectangle) setRectangle(false)
    setSquare(true)
    handleClick({type: 'square'})
  }
  const propagateRectangle = () => {
    if(square) setSquare(false)
    setRectangle(true)
    handleClick({type: 'rectangle'})
  }
  const propagateShowHide = (type) => {
    if(type === 'name') {
      setShowName(!showName)
      handleClick({type: 'show-hide', subtype: 'name', show: showName})
    } else if(type === 'date') {
      setShowDate(!showDate)
      handleClick({type: 'show-hide', subtype: 'date', show: showDate})
    } else if(type === 'distance') {
      setShowDistance(!showDistance)
      handleClick({type: 'show-hide', subtype: 'distance', show: showDistance})
    } else if(type === 'duration') {
      setShowDuration(!showDuration)
      handleClick({type: 'show-hide', subtype: 'duration', show: showDuration})
    } else if(type === 'elevation') {
      setShowElevation(!showDuration)
      handleClick({type: 'show-hide', subtype: 'elevation', show: showElevation})
    } else if(type === 'average') {
      setShowAverage(!showAverage)
      handleClick({type: 'show-hide', subtype: 'average', show: showAverage})
    } else if(type === 'power') {
      setShowPower(!showPower)
      handleClick({type: 'show-hide', subtype: 'power', show: showPower}) 
    } else if(type === 'coordinates') {
      setShowCoordinates(!showCoordinates)
      handleClick({type: 'show-hide', subtype: 'coordinates', show: showCoordinates})
    }
  }

  const shareStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(0.5)'
  }
  const modifyStyle = {
    fill: showModifyImage ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.5)'
  }
  const textStyle = {
    fill: showModifyText ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.5)'
  }
  const squareStyle = {
    fill: square ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.5)'
  }
  const rectangleStyle = {
    fill: rectangle ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.5)'
  }
  const eyeStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(0.5)'
  }

  const returnsColors = () => {
    if(!colors.length) {
      for(let color in brandingPalette) {
        let styleColor = {
          backgroundColor: brandingPalette[color],
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          border: '2px solid ' + brandingPalette['background']
        }
        colors.push(<div className="colors" key={color} style={styleColor} onClick={() => handleClick({type: 'changing-color', color: brandingPalette[color]})}/>)
      }
      console.log('colors', colors)
    }
    return (colors)
  }

  const nameController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showName && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('name')} />)}
          {!showName && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('name')} />)}
        </div>
        <p>NAME: {activity.beautyName}</p>
      </div>
    )
  }
  const dateController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDate && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('date')} />)}
          {!showDate && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('date')} />)}
        </div>
        <p>DATE: {activity.beautyDate}</p>
      </div>
    )
  }
  const distanceController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDistance && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('distance')} />)}
          {!showDistance && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('distance')} />)}
        </div>
        <p>DISTANCE: {activity.beautyDistance}</p>
      </div>
    )
  }
  const durationController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDuration && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('duration')} />)}
          {!showDuration && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('duration')} />)}
        </div>
        <p>DURATION: {activity.beautyDuration}</p>
      </div>
    )
  }
  const elevationController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showElevation && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('elevation')} />)}
          {!showElevation && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('elevation')} />)}
        </div>
        <p>DURATION: {activity.beautyElevation}</p>
      </div>
    )
  }
  const averageController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showAverage && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('average')} />)}
          {!showAverage && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('average')} />)}
        </div>
        <p>AVERAGE: {activity.beautyAverage}</p>
      </div>
    )
  }
  const powerController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showPower && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('power')} />)}
          {!showPower && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('power')} />)}
        </div>
        <p>POWER: {activity.beautyPower}</p>
      </div>
    )
  }
  const coordinatesController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showCoordinates && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('coordinates')} />)}
          {!showCoordinates && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('coordinates')} />)}
        </div>
        <p>COORDINATES: {activity.beautyCoordinates}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="wrapper-buttons">
        <div style={textStyle} onClick={() => showModifySetText()}>
          <TextSVG />
        </div>
        <div style={modifyStyle} onClick={() => showModifySetImage()}>
          <ModifySVG />
        </div>
        <div style={shareStyle} onClick={() => handleClick({type: 'share'})}>
          <ShareSVG />
        </div>
      </div>
      {showModifyImage && (
        <div>
          <div className="wrapper-buttons">
            <RectangleSVG style={rectangleStyle} onClick={() => propagateRectangle()}/>
            <SquareSVG style={squareStyle} onClick={() => propagateSquare()}/>
          </div>
          <div className="wrapper-buttons colors-background">
            {returnsColors()}
          </div>
        </div>
      )}
      {showModifyText && (
        <div>
          {nameController()}
          {dateController()}
          {distanceController()}
          {durationController()}
          {elevationController()}
          {averageController()}
          {powerController()}
          {coordinatesController()}
        </div>
      )}
    </div>
  )
}

export default ButtonImage