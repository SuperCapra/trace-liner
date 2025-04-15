import '../App.css';
import React, {useState} from 'react';
import SelectedImage from './SelectedImage';
import logUtils from '../utils/logUtils';
import brandingPalette from '../config/brandingPalette';
import colorText from '../config/colorText';
import {vocabulary} from '../config/vocabulary';
// import {ReactComponent as ShareSVG} from '../assets/images/share.svg'
// import {ReactComponent as ModifySVG} from '../assets/images/modify.svg'
// import {ReactComponent as TextSVG} from '../assets/images/text.svg'
import {ReactComponent as RectangleSVG} from '../assets/images/rectangle.svg'
import {ReactComponent as SquareSVG} from '../assets/images/square.svg'
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'
// import {ReactComponent as UnitMeasureSVG} from '../assets/images/unitMeasure.svg'
import {ReactComponent as FilterSVG} from '../assets/images/filter.svg'
import {ReactComponent as ResolutionSVG} from '../assets/images/resolution.svg'
import {ReactComponent as ArrowDownSVG} from '../assets/images/arrowDownSimplified.svg'
// import {ReactComponent as PlusSVG} from '../assets/images/plus.svg'
// import {ReactComponent as MinusSVG} from '../assets/images/minus.svg'
import image1 from '../assets/images/image1.jpg'
import image2 from '../assets/images/image2.jpg'
import image3 from '../assets/images/image3.jpg'
import image4 from '../assets/images/image4.jpg'
import image5 from '../assets/images/image5.jpg'
import image6 from '../assets/images/image6.jpg'
import image7 from '../assets/images/image7.jpg'
// import image8 from '../assets/images/image8.jpeg'
// import image9 from '../assets/images/image9.jpeg'
// import image10 from '../assets/images/image10.jpg'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ButtonImage(props) {

  const { activity, unitMeasure, language, handleClickButton } = props

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
  const [showCalories, setShowCalories] = useState(true);
  const [textUp, setTextUp] = useState(false);
  const [altitudeVertical, setAltitudeVertical] = useState(false);
  const [enableUploading, setEnableUploading] = useState(true)
  const [valueFilter, setValueFilter] = useState(0);
  const [valueResolution, setValueResolution] = useState(100);
  const [showMode1, setShowMode1] = useState(true);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  const [showMode4, setShowMode4] = useState(false);
  const [showMode5, setShowMode5] = useState(false);
  const [showMode6, setShowMode6] = useState(false);

  // const [selectedUnsetBlendMode, setSelectedUnsetBlendMode] = useState(true);
  // const [selectedDifferenceBlendMode, setSelectedDifferenceBlendMode] = useState(false);
  // const [selectedExclusionBlendMode, setSelectedExclusionBlendMode] = useState(false);
  const colors = []
  const [images,setImages] = useState([{
    photo: image1, 
    alt: 'default-1',
    selected: true,
  },{
    photo: image2, 
    alt: 'default-2',
    selected: false,
  },{
    photo: image3, 
    alt: 'default-3',
    selected: false,
  },{
    photo: image4, 
    alt: 'default-4',
    selected: false,
  },{
    photo: image5, 
    alt: 'default-5',
    selected: false,
  },{
    photo: image6, 
    alt: 'default-6',
    selected: false,
  },{
    photo: image7, 
    alt: 'default-7',
    selected: false,
  }])

  const showModifySetImage = () => {
    setModifyText(false)
    setModifyImgae(!showModifyImage)
  }
  const showModifySetText = () => {
    setModifyImgae(false)
    setModifyText(!showModifyText)
  }
  const handleClick = (data) => {
    // pregenerateImage()
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
  // const propagateTwice = () => {
  //   handleClick({type: 'twice'})
  // }
  // const propagateBlendMode = (blendModeSetting) => {
  //   handleClick({type: 'blend-mode', blendMode: blendModeSetting})
  //   setSelectedUnsetBlendMode(blendModeSetting === 'unset' ? true : false)
  //   setSelectedDifferenceBlendMode(blendModeSetting === 'difference' ? true : false)
  //   setSelectedExclusionBlendMode(blendModeSetting === 'exclusion' ? true : false)
  // }
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
    } else if(type === 'calories') {
      handleClick({type: 'show-hide', subtype: 'calories', show: !showCalories})
      setShowCalories(!showCalories)
    } else if(type === 'switchText') {
      handleClick({type: 'switch-text', textUp: !textUp})
      setTextUp(!textUp)
    } else if(type === 'switchAltitude') {
      handleClick({type: 'switch-altitude', altitudeVertical: !altitudeVertical})
      setAltitudeVertical(!altitudeVertical)
    } else if(type === 'mode1') {
      if(showMode1) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode1', show: !showMode1})
        setShowMode1(true)
        enableMode1(true, true)
        setFalseOthermode(type)
      }
    } else if(type === 'mode2') {
      if(showMode2) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode2', show: !showMode2})
        setShowMode2(true)
        setFalseOthermode(type)
        enableMode2()
      }
    } else if(type === 'mode3') {
      if(showMode3) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode3', show: !showMode3})
        setFalseOthermode(type)
        setShowMode3(true)
        enableMode3()
      }
    } else if(type === 'mode4') {
      if(showMode4) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode4', show: !showMode4})
        setFalseOthermode(type)
        setShowMode4(true)
        enableMode4()
      }
    } else if(type === 'mode5') {
      if(showMode5) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode5', show: !showMode5})
        setShowMode5(true)
        setFalseOthermode(type)
        enableMode5()
      }
    } else if(type === 'mode6') {
      if(showMode6) return
      else {
        handleClick({type: 'show-hide', subtype: 'mode6', show: !showMode6})
        setShowMode6(true)
        setFalseOthermode(type)
        enableMode6()
      }
    }
  }

  const setFalseOthermode = (mode) => {
    if(mode !== 'mode1') setShowMode1(false)
    if(mode !== 'mode2') setShowMode2(false)
    if(mode !== 'mode3') setShowMode3(false)
    if(mode !== 'mode4') setShowMode4(false)
    if(mode !== 'mode5') setShowMode5(false)
    if(mode !== 'mode6') setShowMode6(false)
  }

  const propagateColor = (info) => {
    handleClick(info)
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
  }

  const enableMode4 = () => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }

  const enableMode5 = () => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }

  const enableMode6 = () => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    setShowCalories(true)
  }

  const unitMeasureStyle = {
    color: brandingPalette.primary,
  }
  const shareStyle = {
    color: brandingPalette.primary,
  }
  const modifyStyle = {
    color: showModifyImage ? brandingPalette.secondary : brandingPalette.primary,
  }
  const textStyle = {
    color: showModifyText ? brandingPalette.secondary : brandingPalette.primary,
  }
  const squareStyle = {
    color: square ? brandingPalette.secondary : brandingPalette.primary,
  }
  const rectangleStyle = {
    fill: rectangle ? brandingPalette.secondary : brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const eyeStyle = {
    fill: brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const subEyeStyle = {
    fill: brandingPalette.tertiary,
    transform: 'scale(0.55)'
  }
  const subSwitchStyle = {
    fill: brandingPalette.tertiary,
    transform: 'scale(0.55)',
  }
  const subSwitchStyleDown = {
    fill: brandingPalette.tertiary,
    transform: 'scale(0.55)',
    rotate: '180deg'
  }
  // const unsetBlendModeStyle = {
  //   color: selectedUnsetBlendMode ? brandingPalette.background : brandingPalette.primary,
  //   backgroundColor: selectedUnsetBlendMode ? brandingPalette.secondary : 'unset',
  //   margin: '2%',
  //   padding: '1%',
  //   borderRadius: '5px'
  // }

  // const differenceBlendModeStyle = {
  //   color: selectedDifferenceBlendMode ? brandingPalette.background : brandingPalette.primary,
  //   backgroundColor: selectedDifferenceBlendMode ? brandingPalette.secondary : 'unset',
  //   margin: '2%',
  //   padding: '1%',
  //   borderRadius: '5px'
  // }

  // const exclusionBlendModeStyle = {
  //   color: selectedExclusionBlendMode ? brandingPalette.background : brandingPalette.primary,
  //   backgroundColor: selectedExclusionBlendMode ? brandingPalette.secondary : 'unset',
  //   margin: '2%',
  //   padding: '1%',
  //   borderRadius: '5px'
  // }

  const returnsColors = () => {
    if(!colors.length) {
      for(let color in colorText) {
        // if(!selectedUnsetBlendMode && color === 'black') continue
        // if(!selectedUnsetBlendMode && showMode3 && color === 'background') continue
        let styleColor = {
          backgroundColor: colorText[color],
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          border: '2px solid ' + brandingPalette['background']
        }
        colors.push(<div className="colors" key={color} style={styleColor} onClick={() => propagateColor({type: 'changing-color', color: colorText[color]})}/>)
      }
      logUtils.loggerText('colors', colors)
    }
    return (colors)
  }

  const handleChangeValueFilter = (value) => {
    setValueFilter(value);
    handleClick({type: 'filterSlider', value: value})
  }
  const handleChangeValueResolution = (value) => {
    setValueResolution(value);
    handleClick({type: 'resolutionSlider', value: value})
  }
  
  const textViewController = (label, propagationKey, value, isVisible) => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {isVisible && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide(propagationKey)} />)}
          {!isVisible && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide(propagationKey)} />)}
        </div>
        <p>{vocabulary[language][label]}: {value}</p>
      </div>
    )
  }
  const textArrowController = (label, propagationKey, isVisible) => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {isVisible && (<ArrowDownSVG style={subSwitchStyle} onClick={() => propagateShowHide(propagationKey)} />)}
          {!isVisible && (<ArrowDownSVG style={subSwitchStyleDown} onClick={() => propagateShowHide(propagationKey)} />)}
        </div>
        <p>{vocabulary[language][label]}</p>
      </div>
    )
  }

  const returnImages = () => {
    // if(props.activity.photoUrlProxied) {
    //   images = [{
    //     photo: props.activity.photoUrlProxied, 
    //     alt: 'activity'
    //   },...images]
    // }
    console.log('images:', images)
    let htmlImages = []
    for(let element of images) {

      let classesForSelected = element.selected ? "selected-image see-selected" : "selected-image no-see-selected"
      htmlImages.push(<div key={element.alt + 'wrapper'} className="wrapper-image-selected"><div key={element.alt + '-selected'} id={element.alt + '-selected'} className={classesForSelected}><SelectedImage/></div><img src={element.photo} id={element.alt} key={element.alt} onClick={() => resetImage(element.alt)} className="image-props" alt={element.alt}/></div>)
    }
    return(htmlImages)
  }

  const resetImage = (alt) => {
    selectImage(alt)
    // deselectImage()
    const elementChosen = document.getElementById(alt)
    const elementChosenSelected = document.getElementById(alt + '-selected')
    if(elementChosenSelected) {
      elementChosenSelected.classList.remove('no-see-selected-image')
      elementChosenSelected.classList.add('see-selected-image')
    }
    const src = elementChosen.getAttribute('src');
    console.log('elementChosen: ', elementChosen)
    handleClick({type: 'image', image: src, info: alt})
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
        // returnImages(imageDataURL)
        let tempImages = images
        let key = images.length + 1
        let alt = 'loaded-images-' + key
        let indexSelected = tempImages.findIndex(x => x.selected === true)
        if(indexSelected !== -1) tempImages[indexSelected].selected = false
        tempImages.push({
          photo: imageDataURL, 
          alt: alt,
          selected: true})
        setImages(tempImages)
        handleClick({type: 'image', image: imageDataURL})
        if(tempImages.length > 11) {
          setEnableUploading(false)
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const selectImage = (alt) => {
    let tempImages = images
    let indexSelected = tempImages.findIndex(x => x.selected === true)
    let indexSelecting = tempImages.findIndex(x => x.alt === alt)
    if(indexSelected !== -1) tempImages[indexSelected].selected = false
    if(indexSelecting !== -1) tempImages[indexSelecting].selected = true
    setImages(tempImages)
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
        {/* <div className="wrapper-buttons-left">
          {showMode4 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode4')} />)}
          {!showMode4 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode4')} />)}
          <p>MODE 4</p>
        </div>
        {showMode4 && displayMode4()} */}
        <div className="wrapper-buttons-left">
          {showMode5 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode5')} />)}
          {!showMode5 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode5')} />)}
          <p>MODE 5</p>
        </div>
        {showMode5 && displayMode5()}
        <div className="wrapper-buttons-left">
          {showMode6 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode6')} />)}
          {!showMode6 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode6')} />)}
          <p>MODE 6</p>
        </div>
        {showMode6 && displayMode6()}
      </div>
    )
  }

  const displayMode1 = () => {
    return (
      <div className="width-mode-sub">
        {textViewController('BUTTON_TITLE', 'name', activity.beautyName, showDate)}
        {activity.beautyDatetimeLanguages[language] && textViewController('BUTTON_DATE', 'date', activity.beautyDatetimeLanguages[language], showDate)}
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)}
        {activity.beautyDuration && textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)}
        {activity.beautyPower && textViewController('BUTTON_POWER', 'power', activity.beautyPower, showPower)}
        {activity[unitMeasure].beautyAverage && textViewController('BUTTON_AVERAGE', 'average', activity[unitMeasure].beautyAverage, showAverage)}
        {activity.beautyCoordinates && textViewController('BUTTON_COORDINATES', 'coordinates', activity.beautyCoordinates, showCoordinates)}
      </div>
    )
  }

  const displayMode2 = () => {
    return (
      <div className="width-mode-sub">
        {textViewController('BUTTON_TITLE', 'name', activity.beautyName, showDate)}
        {activity.beautyDatetimeLanguages[language] && textViewController('BUTTON_DATE', 'date', activity.beautyDatetimeLanguages[language], showDate)}
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)}
        {activity.beautyDuration && textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)}
      </div>
    )
  }
  const displayMode3 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)}
        {activity.beautyDuration && textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)}
        {!altitudeVertical && activity.beautyPower && textViewController('BUTTON_POWER', 'power', activity.beautyPower, showPower)}
        {!altitudeVertical && activity[unitMeasure].beautyAverage && textViewController('BUTTON_AVERAGE', 'average', activity[unitMeasure].beautyAverage, showAverage)}
        {textArrowController('BUTTON_SWITCH_ALTITUDE', 'switchAltitude', altitudeVertical)}
        {/* {activity.beautyCoordinates && coordinatesController()} */}
      </div>
    )
  }
  const displayMode4 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)}
        {activity.beautyDuration && textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)}
      </div>
    )
  }
  const displayMode5 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)}
        {activity.beautyDuration && textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)}
        {textArrowController('BUTTON_SWITCH', 'switchText', textUp)}
      </div>
    )
  }
  const displayMode6 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistanceSpaced, showDistance)}
        {activity[unitMeasure].beautyElevation && textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevationGain, showElevation)}
        {activity.beautyMovingTime && textViewController('BUTTON_MOVING_TIME', 'duration', activity.beautyMovingTime, showDuration)}
        {activity.beautyPower && textViewController('BUTTON_POWER', 'power', activity.beautyPowerSpaced, showPower)}
        {activity[unitMeasure].beautyAverage && textViewController('BUTTON_AVERAGE', 'average', activity[unitMeasure].beautyAverage, showAverage)}
        {activity.beautyCalories && textViewController('BUTTON_CALORIES', 'calories', activity.beautyCalories, showCalories)}
      </div>
    )
  }
  // const minusFilter = () => {
  //   handleClick({type: 'filter', direction: 'minus'})
  // }
  // const plusFilter = () => {
  //   handleClick({type: 'filter', direction: 'plus'})
  // }
  // const minusResolution = () => {
  //   handleClick({type: 'resolution', direction: 'minus'})
  // }
  // const plusResolution = () => {
  //   handleClick({type: 'resolution', direction: 'plus'})
  // }

  // const captureAndUploadImage = (canvas, titleImage, type, blob) => {
  //   try {
  //     // Convert canvas to Blob
  //     canvas.toBlob(async (blob) => {
  //       if (blob) {
  //         // Send the blob to the proxy server
  //         const uploadedImageUrl = await uploadImageToProxy(blob, titleImage);
  //         logUtils.loggerText('url:', uploadedImageUrl)
          
  //         // Share the URL once the image is uploaded
  //         if (uploadedImageUrl) {
  //           shareImageUrl(uploadedImageUrl, titleImage, type, blob);
  //         }
  //       }
  //     }, 'image/jpeg'); // You can set the quality of the JPEG here if needed
  //   } catch (error) {
  //     console.error('Error capturing and uploading image:', error);
  //     downloadImage(titleImage.replace('.' + type, ''), blob, type)
  //   }
  // };

  // const uploadImageToProxy = async (blob, titleImage) => {
  //   const formData = new FormData();
  //   formData.append('file', blob, titleImage);
  //   let origin = window.location.origin
  //   logUtils.loggerText('formData:', formData)
  
  //   try {
  //     const response = await fetch(origin + '/upload?server=' + origin, {  // Proxy URL
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data.url;  // Return the uploaded image URL
  //     } else {
  //       throw new Error('Image upload failed');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  return (
    <div className="display-buttons">
      <div className="wrapper-buttons">
        <div style={unitMeasureStyle} className="feature" onClick={() => propagateUnitMeasure()}>
          <p className="p-dimention-xs p-left">{vocabulary[language].BUTTON_METRICS}</p>
          {/* <UnitMeasureSVG className="feature" /> */}
        </div>
        <div style={textStyle} className="feature" onClick={() => showModifySetText()}>
          <p className="p-dimention-xs p-left">{vocabulary[language].BUTTON_MODE}</p>
          {/* <TextSVG className="feature" /> */}
        </div>
        <div style={modifyStyle} className="feature" onClick={() => showModifySetImage()}>
          <p className="p-dimention-xs p-left">{vocabulary[language].BUTTON_EDIT}</p>
          {/* <ModifySVG className="feature" /> */}
        </div>
        <div style={shareStyle} className="feature" onClick={() => handleClickButton({type: 'downloadshare', subtype: 'jpeg'})}>
          <p className="p-dimention-xs p-left">{vocabulary[language].BUTTON_SHARE}</p>
          {/* <ShareSVG className="feature"/> */}
        </div>
      </div>
      {showModifyImage && (
        <div className="wrapper-controller">
          <div className="wrapper-sub-buttons">
            <RectangleSVG className="proportion" style={rectangleStyle} onClick={() => propagateRectangle()}/>
            <SquareSVG className="proportion" style={squareStyle} onClick={() => propagateSquare()}/>
            {/* <SquareSVG style={squareStyle} onClick={() => propagateTwice()}/> */}
          </div>
          {/* <div className="wrapper-sub-buttons">
            <p className="blend-title blend-text">BLEND:</p>
            <p className="blend-mode blend-text" style={unsetBlendModeStyle} onClick={() => propagateBlendMode('unset')}>none</p>
            <p className="blend-mode blend-text" style={differenceBlendModeStyle} onClick={() => propagateBlendMode('difference')}>diff.</p>
            <p className="blend-mode blend-text" style={exclusionBlendModeStyle} onClick={() => propagateBlendMode('exclusion')}>excl.</p>
          </div> */}
          {/* <div className="wrapper-sub-buttons slider-width">
            <MinusSVG onClick={() => minusFilter()} />
            <FilterSVG></FilterSVG>
            <PlusSVG onClick={() => plusFilter()}/>
            <MinusSVG onClick={() => minusResolution()}/>
            <ResolutionSVG></ResolutionSVG>
            <PlusSVG onClick={() => plusResolution()}/>
          </div> */}
          <div className="wrapper-sub-buttons slider-width">
            <div className="wrapper-icon-sliders display-flex">
              <ResolutionSVG style={shareStyle}></ResolutionSVG>
            </div> 
            <Slider value={valueResolution} onChange={handleChangeValueResolution} />
          </div>
          <div className="wrapper-sub-buttons slider-width">
            <div className="wrapper-icon-sliders display-flex">
              <FilterSVG style={shareStyle}></FilterSVG>
            </div> 
            <Slider value={valueFilter} onChange={handleChangeValueFilter} />
          </div>
          <div className="wrapper-sub-buttons colors-background">
            {returnsColors()}
          </div>
          <div className="wrapper-sub-buttons wrapper-images image-background">
            {returnImages()}
            {enableUploading && (<div className="image-container" onClick={handleClickPlus}><div className="image-square"><p>+</p></div></div>)}
            <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={loadImage} />
          </div>
        </div>
      )}
      {showModifyText && (
        <div className="width-mode">
          {modeController()}
        </div>
      )}
    </div>
  )
}

export default ButtonImage