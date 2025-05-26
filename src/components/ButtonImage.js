import '../App.css';
import React, {useState, useEffect} from 'react';
import logUtils from '../utils/logUtils';
import brandingPalette from '../config/brandingPalette';
import colorText from '../config/colorText';
import {vocabulary} from '../config/vocabulary';
import {ReactComponent as StorySVG} from '../assets/images/stories.svg'
import {ReactComponent as PostSVG} from '../assets/images/post.svg'
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'
import {ReactComponent as ArrowDownSVG} from '../assets/images/arrowDownSimplified.svg'
import image1 from '../assets/images/imagebackground1.jpg'
import image2 from '../assets/images/imagebackground2.jpg'
import image3 from '../assets/images/imagebackground3.jpg'
import image4 from '../assets/images/imagebackground4.jpg'
import image5 from '../assets/images/imagebackground5.jpg'
import image6 from '../assets/images/imagebackground6.jpg'
import {ReactComponent as PlusSVG} from '../assets/images/plus2.svg'
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
  const [imageSelected, setImageSelected] = useState(false);
  const [valueFilter, setValueFilter] = useState(0);
  const [valueResolution, setValueResolution] = useState(100);
  const [showMode1, setShowMode1] = useState(true);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  const [showMode4, setShowMode4] = useState(false);
  const [showMode5, setShowMode5] = useState(false);
  const [showMode6, setShowMode6] = useState(false);
  const [drawingColor, setDrawingColor] = useState(colorText.textwhite);

  const colorsController = []
  const [images,setImages] = useState([{
    photo: image1, 
    alt: 'default-1',
    selected: false,
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
    selected: true,
  },{
    photo: image5, 
    alt: 'default-5',
    selected: false,
  },{
    photo: image6, 
    alt: 'default-6',
    selected: false,
  }])

  const showModifySetImage = () => {
    setModifyText(false)
    activateModeOrEdit('editElement','modeElement')
    setModifyImgae(!showModifyImage)
    setTimeout(() => updateLayerSize(),50)
  }
  const showModifySetText = () => {
    setModifyImgae(false)
    activateModeOrEdit('modeElement','editElement')
    setModifyText(!showModifyText)
    setTimeout(() => updateLayerSize(),50)
  }
  const activateModeOrEdit = (activate, deactivate) => {
    const elementActivate = document.getElementById(activate)
    const elementDeactivate = document.getElementById(deactivate)
    if(elementActivate && !elementActivate.classList.contains('feature-active')) elementActivate.classList.add('feature-active')
    else if(elementActivate.classList.contains('feature-active')) elementActivate.classList.remove('feature-active')
    if(elementDeactivate && elementDeactivate.classList.contains('feature-active')) elementDeactivate.classList.remove('feature-active')
  }
  const handleClick = (data) => {
    handleClickButton(data)
  }
  const propagatePost = () => {
    if(rectangle) setRectangle(false)
    setSquare(true)
    handleClick({type: 'post'})
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
    setDrawingColor(info.color)
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

  const shareStyle = {
    color: brandingPalette.primary,
    fill: brandingPalette.primary
  }
  const modifyStyle = {
    color: showModifyImage ? brandingPalette.primary : brandingPalette.secondary,
  }
  const textStyle = {
    color: showModifyText ? brandingPalette.primary : brandingPalette.secondary,
  }
  const squareStyle = {
    stoke: (square ? brandingPalette.secondary : brandingPalette.primary) + ' !important',
  }
  const rectangleStyle = {
    stroke: (rectangle ? brandingPalette.tertiary : brandingPalette.primary) + ' !important',
    fill: (rectangle ? brandingPalette.tertiary : brandingPalette.primary) + ' !important',
  }
  const classesRectangle = rectangle ? 'proportion margin-10 stroke-primary' : 'proportion margin-10 stroke-secondary'
  const classesSquare = square ? 'proportion margin-10 stroke-primary' : 'proportion margin-10 stroke-secondary'
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

  const returnsColorsController = () => {
    if(!colorsController.length) {
      colorsController.push(<div className="colors-flex-header">
          <p className="p-dimention margin-horizontal p-uppercase">{vocabulary[language].LINE}</p>
          <p className="p-dimention margin-horizontal p-uppercase">{vocabulary[language].BACKGROUND}</p>
          </div>)
      let i = 0
      for(let color in colorText) {
        let elementImage = images[i]
        let styleColor = {
          backgroundColor: colorText[color],
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          border: (color === 'textblack' ? '1px solid ' + brandingPalette['white'] : '2px solid ' + brandingPalette['background']),
          filter: drawingColor === colorText[color] ? 'brightness(0.6)' : 'unset'
        }
        let styleImage = {
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          border: (color === 'textblack' ? '1px solid ' + brandingPalette['white'] : '2px solid ' + brandingPalette['background']),
          filter: elementImage.selected ? 'brightness(0.6)' : 'unset'
        }
        let styleSelected = {
          width: '0px',
          height: '0px',
          borderRadius: '6px',
          border: (color === 'textblack' ? '5px solid ' + brandingPalette['white'] : '6px solid ' + brandingPalette['background']),
        }
        let styleSelectedImage = {
          width: '0px',
          height: '0px',
          borderRadius: '6px',
          border: (color === 'textblack' ? '5px solid ' + brandingPalette['white'] : '6px solid ' + brandingPalette['background']),
          position: 'absolute',
          zIndex: '10',
          transform: color === 'textblack' ? 'translate(11px, 11px)' : 'translate(10px, 10px)',
          filter: 'brightness(0.6)'
        }
        let styleWrapper = {
          height : '32px'
        }
        let valueText = color.replace('text','')
        let classesColor = (color === 'textblack' ? 'colors-black ' : 'colors ') + 'colors-selected'
        let classesColorSelected = (color === 'textblack' ? 'colors-black ' : 'colors ') + 'colors-selected'
        let markupColor = drawingColor === colorText[color] ? 
          <div className={classesColorSelected} key={color} style={styleColor}>
            <div key={color + 'selected'} style={styleSelected}/>
          </div> : 
          <div className={classesColor} key={color} style={styleColor} onClick={() => propagateColor({type: 'changing-color', color: colorText[color]})}/>
        let markupImage = elementImage.selected ? 
        <div key={elementImage.alt + 'wrapper'} style={styleWrapper}>
          <div key={color + 'selected'} style={styleSelectedImage}/>
          <img src={elementImage.photo} id={elementImage.alt} className={classesColor} alt={elementImage.alt} style={styleImage}/>
        </div> :
          // <img src={elementImage.photo} id={elementImage.alt} className="colors" alt={elementImage.alt} style={styleImage}/> : 
          <img src={elementImage.photo} id={elementImage.alt} key={elementImage.alt} onClick={() => resetImage(elementImage.alt)} className={classesColor} alt={elementImage.alt} style={styleImage}/>
        colorsController.push(<div className="colors-flex">
          {markupColor}
          <p className="p-dimention margin-horizontal p-uppercase">{valueText}</p>
          {markupImage}
          </div>)
        i++
      }
      let stylePhantom = {
        backgroundColor: 'rgb(0,0,0,0)',
        width: '20px',
        height: '20px',
        borderRadius: '20px',
        border: '2px solid rgb(0,0,0,0)',
      }
      let styleImage = {
        backgroundColor: 'var(--palette-primary',
        width: '20px',
        height: '20px',
        borderRadius: '20px',
        border: '2px solid black',
      }
      let markupImage = imageSelected && images[colorText.length] ? <div className="colors-phantom image-loader" key="phantom" style={styleImage} onClick={handleClickPlus}>
          <img src={images[colorText.length].photo} id={images[colorText.length].alt} key={images[colorText.length].alt} onClick={() => resetImage(images[colorText.length].alt)} className="colors" alt={images[colorText.length].alt} style={styleImage}/>
          <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={loadImage} />
        </div> : <div className="colors-phantom image-loader" key="phantom" style={styleImage} onClick={handleClickPlus}>
          <PlusSVG></PlusSVG>
          <input id="fileInput" type="file" accept="image/*" style={{display: 'none'}} onChange={loadImage} />
        </div>
      colorsController.push(<div className="colors-flex">
        <div className="colors-phantom" key="phantomColor" style={stylePhantom}></div>
        <p className="p-dimention margin-horizontal p-uppercase">IMAGE</p>
        {markupImage}
      </div>)
      logUtils.loggerText('colors label', colorsController)
    }
    return (colorsController)
  }

  const handleChangeValueFilter = (value) => {
    setValueFilter(value);
    handleClick({type: 'filterSlider', value: value})
  }
  const handleChangeValueResolution = (value) => {
    setValueResolution(value);
    handleClick({type: 'resolutionSlider', value: value})
  }
  
  const textViewController = (label, propagationKey, value, isVisible, deactivated) => {
    let activatedElement = (<div className="wrapper-buttons-left wrapper-buttons-left-activated">
      <div>
        {isVisible && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide(propagationKey)} />)}
        {!isVisible && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide(propagationKey)} />)}
      </div>
      <p className="p-dimention-xs">{vocabulary[language][label]}: {value}</p>
    </div>)
    let deactivatedElement = (<div className="wrapper-buttons-left wrapper-buttons-left-deactivated">
      <div>
        {isVisible && (<ViewSVG style={subEyeStyle}/>)}
        {!isVisible && (<HideSVG style={subEyeStyle}/>)}
      </div>
      <p className="p-dimention-xs">{vocabulary[language][label]}: {value}</p>
    </div>)
    return deactivated ? deactivatedElement : activatedElement
  }
  const textArrowController = (label, propagationKey, isVisible, deactivated) => {
    let activatedElement = (<div className="wrapper-buttons-left wrapper-buttons-left-activated">
      <div>
        {isVisible && (<ArrowDownSVG style={subSwitchStyle} onClick={() => propagateShowHide(propagationKey)} />)}
        {!isVisible && (<ArrowDownSVG style={subSwitchStyleDown} onClick={() => propagateShowHide(propagationKey)} />)}
      </div>
      <p className="p-dimention-xs">{vocabulary[language][label]}</p>
    </div>)
    let deactivatedElement = (<div className="wrapper-buttons-left wrapper-buttons-left-deactivated">
      <div>
        {isVisible && (<ArrowDownSVG style={subSwitchStyle}/>)}
        {!isVisible && (<ArrowDownSVG style={subSwitchStyleDown}/>)}
      </div>
      <p className="p-dimention-xs">{vocabulary[language][label]}</p>
    </div>)
    return deactivated ? deactivatedElement : activatedElement
  }

  const resetImage = (alt) => {
    selectImage(alt)
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

  const loadImage = (event) => {
    if(event && event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        let tempImages = images
        let key = images.length + 1
        let alt = 'loaded-images-' + key
        let indexSelected = tempImages.findIndex(x => x.selected === true)
        if(indexSelected !== -1) tempImages[indexSelected].selected = false
        tempImages[tempImages.length] = {
          photo: imageDataURL, 
          alt: alt,
          selected: true}
        setImages(tempImages)
        handleClick({type: 'image', image: imageDataURL})
        setImageSelected(true)
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
    let elemenntDistance = showMode6 ? textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistanceSpaced, showDistance) : textViewController('BUTTON_DISTANCE', 'distance', activity[unitMeasure].beautyDistance, showDistance)
    let elemenntElevation = showMode6 ? textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevationGain, showElevation) : textViewController('BUTTON_ELEVATION', 'elevation', activity[unitMeasure].beautyElevation, showElevation)
    let elemenntDuration = showMode6 ? textViewController('BUTTON_MOVING_TIME', 'duration', activity.beautyMovingTime, showDuration) : textViewController('BUTTON_DURATION', 'duration', activity.beautyDuration, showDuration)
    let elemenntPower = showMode6 ? textViewController('BUTTON_POWER', 'power', activity.beautyPowerSpaced, showPower) : textViewController('BUTTON_POWER', 'power', activity.beautyPower, showPower)

    return (<div className="wrapper-modes-text">
      <div className="wrapper-modes">        
        <div className="wrapper-buttons-left">
          {showMode1 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode1')} />)}
          {!showMode1 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode1')} />)}
          <p className="p-dimention-xs">{vocabulary[language].MODE_1}</p>
        </div>
        <div className="wrapper-buttons-left">
          {showMode5 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode5')} />)}
          {!showMode5 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode5')} />)}
          <p className="p-dimention-xs">{vocabulary[language].MODE_2}</p>
        </div>
        <div className="wrapper-buttons-left">
          {showMode6 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode6')} />)}
          {!showMode6 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode6')} />)}
          <p className="p-dimention-xs">{vocabulary[language].MODE_3}</p>
        </div>
      </div>
      <div className="wrapper-texts">
        {activity.beautyName && textViewController('BUTTON_TITLE', 'name', activity.beautyName, showDate, showMode6)}
        {activity.beautyDatetimeLanguages && activity.beautyDatetimeLanguages[language] && textViewController('BUTTON_DATE', 'date', activity.beautyDatetimeLanguages[language], showDate, showMode6 || showMode5)}
        {activity[unitMeasure] && activity[unitMeasure].beautyDistance && elemenntDistance}
        {activity[unitMeasure] && activity[unitMeasure].beautyElevation && elemenntElevation}
        {activity.beautyDuration && elemenntDuration}
        {activity.beautyPower && elemenntPower}
        {activity[unitMeasure] && activity[unitMeasure].beautyAverage && textViewController('BUTTON_AVERAGE', 'average', activity[unitMeasure].beautyAverage, showAverage)}
        {activity.beautyCoordinates && textViewController('BUTTON_COORDINATES', 'coordinates', activity.beautyCoordinates, showCoordinates, showMode6)}
        {activity.beautyCalories && textViewController('BUTTON_CALORIES', 'coordinates', activity.beautyCalories, showCalories, !showMode6)}
        {textArrowController('BUTTON_SWITCH', 'switchText', textUp, !showMode5)}
      </div>
    </div>)
  }

  const updateLayerSize = () => {
    logUtils.loggerText('udating layer size...')
    const styleSheet = document.styleSheets[0];
    const elementLayer = document.getElementsByClassName('display-buttons')
    const elementApp = document.getElementsByClassName('App')
    if(elementLayer && elementLayer.length && elementApp && elementApp.length) {
      let topValue = `-${elementLayer[0].offsetTop}`
      let leftValue = `-${elementLayer[0].offsetLeft}`
      let heightValue = `0`
      if(window.innerWidth < 800) {
        heightValue = `${elementLayer[0].offsetTop + elementLayer[0].offsetHeight}`
      }
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if(rule.selectorText === '.display-buttons::before') {

          if(window.innerWidth < 800) {
            styleSheet.insertRule(`
              .display-buttons::before {
                top: ${topValue}px !important;
                left: ${leftValue}px !important;
                min-height: ${heightValue}px !important;
              }`, styleSheet.cssRules.length);
          } else {
            styleSheet.insertRule(`
              .display-buttons::before {
                top: 0 !important;
                left: 50vw !important;
                min-height: 100vh !important;
              }`, styleSheet.cssRules.length);
          }
          break
        }
      }
    }
  }

  useEffect(() => {
    updateLayerSize()

    window.addEventListener("resize", updateLayerSize)

    return () => window.removeEventListener("resize", updateLayerSize)
  },[

  ])

  return (
    <div className="display-buttons">
      <div className="wrapper-buttons width-mode">
        <div id="modeElement" style={textStyle} className="feature" onClick={() => showModifySetText()}>
          <p className="p-dimention-xs p-left p-margin">{vocabulary[language].BUTTON_MODE}</p>
        </div>
        <div id="editElement" style={modifyStyle} className="feature" onClick={() => showModifySetImage()}>
          <p className="p-dimention-xs p-left p-margin">{vocabulary[language].BUTTON_EDIT}</p>
        </div>
      </div>
      {showModifyImage && (
        <div className="wrapper-controller width-mode">
          <div className="wrapper-sub-buttons flex-wrapper-colors-factor">
            <div className="wrapper-sub-buttons">
              <div>
                {returnsColorsController()}
              </div>
            </div>
            <div className="flex-factor">
              <StorySVG className={classesRectangle} style={rectangleStyle} onClick={() => propagateRectangle()}/>
              <PostSVG className={classesSquare} style={squareStyle} onClick={() => propagatePost()}/>
            </div>

          </div>
          <div className="wrapper-sub-buttons-slider slider-width">
            <div className="wrapper-icon-sliders display-flex width-slider-shrink" style={shareStyle}>
              <p className="p-dimention">{vocabulary[language].DETAIL}</p>
            </div> 
            <Slider className="width-slider-large" value={valueResolution} onChange={handleChangeValueResolution} />
          </div>
          <div className="wrapper-sub-buttons-slider slider-width">
            <div className="wrapper-icon-sliders display-flex width-slider-shrink" style={shareStyle}>
              <p className="p-dimention">{vocabulary[language].SLIDER}</p>
            </div> 
            <Slider className="width-slider-large" value={valueFilter} onChange={handleChangeValueFilter} />
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