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
import image1 from './image1.jpeg'
import image2 from './image2.jpeg'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ButtonImage(props) {

  const { activity, handleClickButton } = props

  const [showModifyImage, setModifyImgae] = useState(false);
  const [showModifyText, setModifyText] = useState(false);
  const [square, setSquare] = useState(false);
  const [rectangle, setRectangle] = useState(true);
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showData, setShowData] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [enableUploading, setEnableUploading] = useState(true)
  const [additionalImages, setAdditionalImages] = useState([]);
  const [valueFilter, setValueFilter] = useState(0);
  const colors = []
  let images = [{
    photo: image1, 
    alt: 'default-1'
  },{
    photo: image2, 
    alt: 'default-2'
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
      setShowDistance(!showDistance)
    } else if(type === 'duration') {
      handleClick({type: 'show-hide', subtype: 'duration', show: !showDuration})
      setShowDuration(!showDuration)
    } else if(type === 'elevation') {
      handleClick({type: 'show-hide', subtype: 'elevation', show: !showElevation})
      setShowElevation(!showDuration)
    } else if(type === 'average') {
      handleClick({type: 'show-hide', subtype: 'average', show: !showAverage})
      setShowAverage(!showAverage)
    } else if(type === 'power') {
      handleClick({type: 'show-hide', subtype: 'power', show: !showPower}) 
      setShowPower(!showPower)
    } else if(type === 'coordinates') {
      handleClick({type: 'show-hide', subtype: 'coordinates', show: !showCoordinates})
      if(showData && !showCoordinates) {
        setShowData(false)
      }
      setShowCoordinates(!showCoordinates)
    } else if(type === 'data') {
      handleClick({type: 'show-hide', subtype: 'data', show: !showData})
      if(showCoordinates && !showData) {
        setShowCoordinates(false)
      }
      setShowData(!showData)
    }
  }

  const shareStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const modifyStyle = {
    fill: showModifyImage ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const textStyle = {
    fill: showModifyText ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const squareStyle = {
    fill: square ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const rectangleStyle = {
    fill: rectangle ? brandingPalette.yellow : brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
  }
  const eyeStyle = {
    fill: brandingPalette.pink,
    transform: 'scale(' + (window.innerWidth / 700) + ')'
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

  // const handleChangeValueFilter = (value) => {
  //   setValueFilter(value);
  //   handleClick({type: 'filterSlider', value: value})
  // }

  const nameController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showName && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('name')} />)}
          {!showName && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('name')} />)}
        </div>
        <p>TITLE: {activity.beautyName}</p>
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
        <p>ELEVATION: {activity.beautyElevation}</p>
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
  const dataController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showData && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('data')} />)}
          {!showData && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('data')} />)}
        </div>
        <p>DATA: {activity.beautyData}</p>
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
          {/* <div className="wrapper-buttons slider-width">
            <Slider value={valueFilter} onChange={handleChangeValueFilter} />
          </div> */}
          <div className="wrapper-buttons colors-background">
            {returnsColors()}
          </div>
          <div className="wrapper-buttons">
            {returnImages()}
            {imageLoading && additionalImages}
            {enableUploading && (<div className="image-container" onClick={handleClickPlus}><div className="image-square"><p>+</p></div></div>)}
            <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={loadImage} />
          </div>
        </div>
      )}
      {showModifyText && (
        <div>
          {nameController()}
          {dateController()}
          {dataController()}
          {/* {distanceController()}
          {durationController()}
          {elevationController()}
          {averageController()}
          {powerController()} */}
          {coordinatesController()}
        </div>
      )}
    </div>
  )
}

export default ButtonImage