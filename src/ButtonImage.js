import './App.css';
import React, {useState} from 'react';
import {ReactComponent as ShareSVG} from './share.svg'
import {ReactComponent as ModifySVG} from './modify.svg'
import {ReactComponent as TextSVG} from './text.svg'
import {ReactComponent as RectangleSVG} from './rectangle.svg'
import {ReactComponent as SquareSVG} from './square.svg'
import {ReactComponent as ViewSVG} from './view.svg'
import {ReactComponent as HideSVG} from './hide.svg'
import {ReactComponent as UnitMeasureSVG} from './unitMeasure.svg'
import brandingPalette from './brandingPalette';
import image1 from './image1.jpeg'
import image2 from './image2.jpeg'
import image3 from './image3.jpeg'
import image4 from './image4.jpeg'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ButtonImage(props) {

  const { activity, unitMeasure, handleClickButton } = props

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
  const [imageLoading, setImageLoading] = useState(false);
  const [enableUploading, setEnableUploading] = useState(true)
  const [additionalImages, setAdditionalImages] = useState([]);
  const [valueFilter, setValueFilter] = useState(0);
  const [showMode1, setShowMode1] = useState(true);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  const colors = []
  let images = [{
    photo: image1, 
    alt: 'default-1'
  },{
    photo: image2, 
    alt: 'default-2'
  },{
    photo: image3, 
    alt: 'default-3'
  },{
    photo: image4, 
    alt: 'default-4'
  }]

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
      handleClick({type: 'show-hide', subtype: 'name', show: !showName})
      if(!showName) {
        setShowDate(true)
      } else {
        setShowDate(false)
      }
      setShowName(!showName)
    } else if(type === 'date' && showName) {
      handleClick({type: 'show-hide', subtype: 'date', show: !showDate})
      setShowDate(!showDate)
    } else if(type === 'distance') {
      handleClick({type: 'show-hide', subtype: 'distance', show: !showDistance})
      if(!showDistance) setShowCoordinates(false)
      setShowDistance(!showDistance)
    } else if(type === 'duration') {
      handleClick({type: 'show-hide', subtype: 'duration', show: !showDuration})
      if(!showDuration) setShowCoordinates(false)
      setShowDuration(!showDuration)
    } else if(type === 'elevation') {
      handleClick({type: 'show-hide', subtype: 'elevation', show: !showElevation})
      if(!showElevation) setShowCoordinates(false)
      setShowElevation(!showElevation)
    } else if(type === 'average') {
      handleClick({type: 'show-hide', subtype: 'average', show: !showAverage})
      if(!showAverage) setShowCoordinates(false)
      setShowAverage(!showAverage)
    } else if(type === 'power') {
      handleClick({type: 'show-hide', subtype: 'power', show: !showPower}) 
      if(!showPower) setShowCoordinates(false)
      setShowPower(!showPower)
    } else if(type === 'coordinates') {
      handleClick({type: 'show-hide', subtype: 'coordinates', show: !showCoordinates})
      if(showCoordinates) {
        enableMode1(false, false)
      }
      setShowCoordinates(!showCoordinates)
    } else if(type === 'mode1') {
      handleClick({type: 'show-hide', subtype: 'mode1', show: !showMode1})
      setShowMode1(!showMode1)
      if(!showMode1) {
        setShowMode2(false)
        setShowMode3(false)
      }
      enableMode1(true, true)
    } else if(type === 'mode2') {
      handleClick({type: 'show-hide', subtype: 'mode2', show: !showMode2})
      setShowMode2(!showMode2)
      if(!showMode2) {
        setShowMode1(false)
        setShowMode3(false)
      }
      enableMode2()
    } else if(type === 'mode3') {
      handleClick({type: 'show-hide', subtype: 'mode3', show: !showMode3})
      setShowMode3(!showMode3)
      if(!showMode3) {
        setShowMode1(false)
        setShowMode2(false)
      }
      enableMode3()
    }
  }

  const enableMode1 = (bool, isStart) => {
    if(isStart) {
      setShowName(bool)
      setShowDate(bool)
    }
    setShowDistance(bool)
    setShowElevation(bool)
    setShowDuration(bool)
    setShowPower(bool)
    setShowAverage(bool)
    setShowCoordinates(!bool)
  }

  const enableMode2 = () => {
    setShowName(true)
    setShowDate(true)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }

  const enableMode3 = () => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    setShowCoordinates(true)
  }

  const unitMeasureStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const shareStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const modifyStyle = {
    fill: showModifyImage ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const textStyle = {
    fill: showModifyText ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const squareStyle = {
    fill: square ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const rectangleStyle = {
    fill: rectangle ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const eyeStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const subEyeStyle = {
    fill: brandingPalette.lightblue,
    transform: 'scale(0.55)'
    // transform: 'scale(' + (window.innerWidth / 700) + ')'
  }

  const returnsColors = () => {
    if(!colors.length) {
      for(let color in brandingPalette) {
        let styleColor = {
          backgroundColor: brandingPalette[color],
          width: '4vw',
          height: '4vw',
          borderRadius: '4vw',
          border: '0.5vw solid ' + brandingPalette['background']
        }
        colors.push(<div className="colors" key={color} style={styleColor} onClick={() => handleClick({type: 'changing-color', color: brandingPalette[color]})}/>)
      }
      console.log('colors', colors)
    }
    return (colors)
  }

  const handleChangeValueFilter = (value) => {
    setValueFilter(value);
    handleClick({type: 'filterSlider', value: value})
  }

  const nameController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showName && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('name')} />)}
          {!showName && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('name')} />)}
        </div>
        <p>TITLE: {activity.beautyName}</p>
      </div>
    )
  }
  const dateController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDate && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('date')} />)}
          {!showDate && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('date')} />)}
        </div>
        <p>DATE: {activity.beautyDate}</p>
      </div>
    )
  }
  const distanceController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDistance && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('distance')} />)}
          {!showDistance && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('distance')} />)}
        </div>
        <p>DISTANCE: {activity[unitMeasure].beautyDistance}</p>
      </div>
    )
  }
  const durationController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showDuration && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('duration')} />)}
          {!showDuration && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('duration')} />)}
        </div>
        <p>DURATION: {activity.beautyDuration}</p>
      </div>
    )
  }
  const elevationController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showElevation && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('elevation')} />)}
          {!showElevation && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('elevation')} />)}
        </div>
        <p>ELEVATION: {activity[unitMeasure].beautyElevation}</p>
      </div>
    )
  }
  const averageController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showAverage && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('average')} />)}
          {!showAverage && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('average')} />)}
        </div>
        <p>AVERAGE: {activity[unitMeasure].beautyAverage}</p>
      </div>
    )
  }
  const powerController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showPower && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('power')} />)}
          {!showPower && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('power')} />)}
        </div>
        <p>POWER: {activity.beautyPower}</p>
      </div>
    )
  }
  const coordinatesController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showCoordinates && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('coordinates')} />)}
          {!showCoordinates && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('coordinates')} />)}
        </div>
        <p>COORDINATES: {activity.beautyCoordinates}</p>
      </div>
    )
  }

  const returnImages = () => {
    if(props.activity.photoUrl) {
      images = [{
        photo: props.activity.photoUrl, 
        alt: 'activity'
      },...images]
    }
    let htmlImages = []
    for(let element of images) {
      console.log(element)
      htmlImages.push(<img src={element.photo} id={element.alt} key={element.alt} onClick={() => resetImage(element.alt)} className="image-props" alt={element.alt}/>)
    }
    return(htmlImages)
  }

  const resetImage = (alt) => {
    const elementChosen = document.getElementById(alt)
    const src = elementChosen.getAttribute('src');
    console.log('elementChosen: ', elementChosen)
    handleClick({type: 'image', image: src})
  }

  const handleClickPlus = () => {
    const fileInput = document.getElementById('fileInput')
    if(fileInput) fileInput.click()
  }

  const propagateUnitMeasure = () => {
    handleClick({type: 'unit', unit: unitMeasure === 'metric' ? 'imperial' : 'metric'})
  }

  const loadImage = (event) => {
    if(event && event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        returnImages(imageDataURL)
        let key = additionalImages.length + 1
        let alt = 'loaded-images-' + key
        setImageLoading(true)
        setAdditionalImages([...additionalImages, <img src={imageDataURL} id={alt} key={key} onClick={() => resetImage(alt)} className="image-props" alt={alt} width="40px" height="40px"/>])
        if(additionalImages.length > 2) {
          setEnableUploading(false)
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const modeController = () => {
    return (
      <div>
        <div className="wrapper-buttons-left">
          {showMode1 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode1')} />)}
          {!showMode1 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode1')} />)}
          <p>MODE 1</p>
        </div>
        {showMode1 && displayMode1()}
        <div className="wrapper-buttons-left">
          {showMode2 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode2')} />)}
          {!showMode2 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode2')} />)}
          <p>MODE 2</p>
        </div>
        {showMode2 && displayMode2()}
        <div className="wrapper-buttons-left">
          {showMode3 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode3')} />)}
          {!showMode3 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode3')} />)}
          <p>MODE 3</p>
        </div>
        {showMode3 && displayMode3()}
      </div>
    )
  }

  const displayMode1 = () => {
    return (
      <div>
        {nameController()}
        {dateController()}
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
        {activity.beautyPower && powerController()}
        {activity[unitMeasure].beautyAverage && averageController()}
        {activity.beautyCoordinates && coordinatesController()}
      </div>
    )
  }

  const displayMode2 = () => {
    return (
      <div>
        {nameController()}
        {dateController()}
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
      </div>
    )
  }
  //TODO define the mode3 data 
  const displayMode3 = () => {    
    return (
      <div>
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
        {activity.beautyPower && powerController()}
        {activity[unitMeasure].beautyAverage && averageController()}
        {activity.beautyCoordinates && coordinatesController()}
      </div>
    )
  }

  return (
    <div>
      <div className="wrapper-buttons">
        <div style={unitMeasureStyle} onClick={() => propagateUnitMeasure()}>
          <UnitMeasureSVG />
        </div>
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
        <div className="wrapper-controller">
          <div className="wrapper-sub-buttons">
            <RectangleSVG style={rectangleStyle} onClick={() => propagateRectangle()}/>
            <SquareSVG style={squareStyle} onClick={() => propagateSquare()}/>
          </div>
          <div className="wrapper-sub-buttons slider-width">
            <Slider value={valueFilter} onChange={handleChangeValueFilter} />
          </div>
          <div className="wrapper-sub-buttons colors-background">
            {returnsColors()}
          </div>
          <div className="wrapper-sub-buttons">
            {returnImages()}
            {imageLoading && additionalImages}
            {enableUploading && (<div className="image-container" onClick={handleClickPlus}><div className="image-square"><p>+</p></div></div>)}
            <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={loadImage} />
          </div>
        </div>
      )}
      {showModifyText && (
        <div>
          {modeController()}
        </div>
      )}
    </div>
  )
}

export default ButtonImage