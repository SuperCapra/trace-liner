import '../App.css';
import React, {useState} from 'react';
import ShareContour from './ShareContour'
import SelectedImage from './SelectedImage';
import logUtils from '../utils/logUtils';
import brandingPalette from '../config/brandingPalette';
import {vocabulary} from '../config/vocabulary';
import {ReactComponent as ShareSVG} from '../assets/images/share.svg'
import {ReactComponent as ModifySVG} from '../assets/images/modify.svg'
import {ReactComponent as TextSVG} from '../assets/images/text.svg'
import {ReactComponent as RectangleSVG} from '../assets/images/rectangle.svg'
import {ReactComponent as SquareSVG} from '../assets/images/square.svg'
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'
import {ReactComponent as UnitMeasureSVG} from '../assets/images/unitMeasure.svg'
import {ReactComponent as FilterSVG} from '../assets/images/filter.svg'
import {ReactComponent as ResolutionSVG} from '../assets/images/resolution.svg'
import {ReactComponent as PlusSVG} from '../assets/images/plus.svg'
import {ReactComponent as MinusSVG} from '../assets/images/minus.svg'
import image1 from '../assets/images/image1.jpeg'
import image2 from '../assets/images/image2.jpeg'
import image3 from '../assets/images/image3.jpeg'
import image4 from '../assets/images/image4.jpeg'
import image5 from '../assets/images/image5.jpg'
import image6 from '../assets/images/image6.jpeg'
import image7 from '../assets/images/image7.jpeg'
import Slider from 'rc-slider';
import SliderRes from 'rc-slider';
import 'rc-slider/assets/index.css';

function ButtonImage(props) {

  const { activity, unitMeasure, language, admin, handleClickButton } = props

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
  const [additionalImagesInfo, setAdditionalImagesInfo] = useState([]);
  const [valueFilter, setValueFilter] = useState(0);
  const [valueResolution, setValueResolution] = useState(100);
  const [showMode1, setShowMode1] = useState(true);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  const [showMode4, setShowMode4] = useState(false);

  // const [selectedUnsetBlendMode, setSelectedUnsetBlendMode] = useState(true);
  // const [selectedDifferenceBlendMode, setSelectedDifferenceBlendMode] = useState(false);
  // const [selectedExclusionBlendMode, setSelectedExclusionBlendMode] = useState(false);
  const colors = []
  let images = [{
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
    } else if(type === 'mode1') {
      handleClick({type: 'show-hide', subtype: 'mode1', show: !showMode1})
      setShowMode1(!showMode1)
      if(!showMode1) {
        setShowMode2(false)
        setShowMode3(false)
        setShowMode4(false)
      }
      enableMode1(true, true)
    } else if(type === 'mode2') {
      handleClick({type: 'show-hide', subtype: 'mode2', show: !showMode2})
      setShowMode2(!showMode2)
      if(!showMode2) {
        setShowMode1(false)
        setShowMode3(false)
        setShowMode4(false)
      }
      enableMode2()
    } else if(type === 'mode3') {
      handleClick({type: 'show-hide', subtype: 'mode3', show: !showMode3})
      setShowMode3(!showMode3)
      if(!showMode3) {
        setShowMode1(false)
        setShowMode2(false)
        setShowMode4(false)
      }
      enableMode3()
    } else if(type === 'mode4') {
      handleClick({type: 'show-hide', subtype: 'mode4', show: !showMode4})
      setShowMode4(!showMode4)
      if(!showMode4) {
        setShowMode1(false)
        setShowMode2(false)
        setShowMode3(false)
      }
      enableMode4()
    }
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
    // setShowCoordinates(true)
  }

  const enableMode4 = () => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    // setShowCoordinates(true)
  }

  const unitMeasureStyle = {
    fill: brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const shareStyle = {
    fill: brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const modifyStyle = {
    fill: showModifyImage ? brandingPalette.secondary : brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const textStyle = {
    fill: showModifyText ? brandingPalette.secondary : brandingPalette.primary,
    transform: 'scale(0.55)'
  }
  const squareStyle = {
    fill: square ? brandingPalette.secondary : brandingPalette.primary,
    transform: 'scale(0.55)'
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
      for(let color in brandingPalette) {
        // if(!selectedUnsetBlendMode && color === 'black') continue
        // if(!selectedUnsetBlendMode && showMode3 && color === 'background') continue
        let styleColor = {
          backgroundColor: brandingPalette[color],
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          border: '2px solid ' + brandingPalette['background']
        }
        colors.push(<div className="colors" key={color} style={styleColor} onClick={() => propagateColor({type: 'changing-color', color: brandingPalette[color]})}/>)
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

  const nameController = () => {
    return(
      <div className="wrapper-buttons-left">
        <div>
          {showName && (<ViewSVG style={subEyeStyle} onClick={() => propagateShowHide('name')} />)}
          {!showName && (<HideSVG style={subEyeStyle} onClick={() => propagateShowHide('name')} />)}
        </div>
        <p>{vocabulary[language].BUTTON_TITLE}: {activity.beautyName}</p>
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
        <p>{vocabulary[language].BUTTON_DATE}: {activity.beautyDatetimeLanguages[language]}</p>
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
        <p>{vocabulary[language].BUTTON_DISTANCE}: {activity[unitMeasure].beautyDistance}</p>
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
        <p>{vocabulary[language].BUTTON_DURATION}: {activity.beautyDuration}</p>
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
        <p>{vocabulary[language].BUTTON_ELEVATION}: {activity[unitMeasure].beautyElevation}</p>
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
        <p>{vocabulary[language].BUTTON_AVERAGE}: {activity[unitMeasure].beautyAverage}</p>
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
        <p>{vocabulary[language].BUTTON_POWER}: {activity.beautyPower}</p>
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
        <p>{vocabulary[language].BUTTON_COORDINATES}: {activity.beautyCoordinates}</p>
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
    let htmlImages = []
    for(let element of images) {
      let classesForSelected = element.selected ? "selected-image see-selected-image" : "selected-image no-see-selected-image"
      htmlImages.push(<div key={element.alt + 'wrapper'} className="wrapper-image-selected"><div key={element.alt + '-selected'} id={element.alt + '-selected'} className={classesForSelected}><SelectedImage/></div><img src={element.photo} id={element.alt} key={element.alt} onClick={() => resetImage(element.alt)} className="image-props" alt={element.alt}/></div>)
    }
    return(htmlImages)
  }

  const resetImage = (alt) => {
    deselectImage()
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
        returnImages(imageDataURL)
        let key = additionalImages.length + 1
        let alt = 'loaded-images-' + key
        deselectImage()
        setImageLoading(true)
        setAdditionalImagesInfo([...additionalImagesInfo, {
          photo: imageDataURL, 
          alt: alt,
          selected: true}])
        setAdditionalImages([...additionalImages, <div key={key + 'wrapper'} className="wrapper-image-selected"><div key={alt + '-selected'} id={alt + '-selected'} className="selected-image see-selected-image"><SelectedImage/></div><img src={imageDataURL} id={alt} key={key} onClick={() => resetImage(alt)} className="image-props" alt={alt} width="40px" height="40px"/></div>])
        handleClick({type: 'image', image: imageDataURL})
        if(additionalImages.length > 2) {
          setEnableUploading(false)
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const deselectImage = () => {
    const selectedImages = document.getElementsByClassName('see-selected-image')
    for(let selectedImage of selectedImages) {
      selectedImage.classList.remove('see-selected-image')
      selectedImage.classList.add('no-see-selected-image')
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
        <div className="wrapper-buttons-left">
          {showMode4 && (<ViewSVG style={eyeStyle} onClick={() => propagateShowHide('mode4')} />)}
          {!showMode4 && (<HideSVG style={eyeStyle} onClick={() => propagateShowHide('mode4')} />)}
          <p>MODE 4</p>
        </div>
        {showMode4 && displayMode4()}
      </div>
    )
  }

  const displayMode1 = () => {
    return (
      <div className="width-mode-sub">
        {nameController()}
        {activity.beautyDatetimeLanguages[language] && dateController()}
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
      <div className="width-mode-sub">
        {nameController()}
        {activity.beautyDatetimeLanguages[language] && dateController()}
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
      </div>
    )
  }
  const displayMode3 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
        {activity.beautyPower && powerController()}
        {activity[unitMeasure].beautyAverage && averageController()}
        {/* {activity.beautyCoordinates && coordinatesController()} */}
      </div>
    )
  }
  const displayMode4 = () => {    
    return (
      <div className="width-mode-sub">
        {activity[unitMeasure].beautyDistance && distanceController()}
        {activity[unitMeasure].beautyElevation && elevationController()}
        {activity.beautyDuration && durationController()}
      </div>
    )
  }
  const minusFilter = () => {
    handleClick({type: 'filter', direction: 'minus'})
  }
  const plusFilter = () => {
    handleClick({type: 'filter', direction: 'plus'})
  }
  const minusResolution = () => {
    handleClick({type: 'resolution', direction: 'minus'})
  }
  const plusResolution = () => {
    handleClick({type: 'resolution', direction: 'plus'})
  }

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
        <div style={unitMeasureStyle} onClick={() => propagateUnitMeasure()}>
          <UnitMeasureSVG className="feature" />
        </div>
        <div style={textStyle} onClick={() => showModifySetText()}>
          <TextSVG className="feature" />
        </div>
        <div style={modifyStyle} onClick={() => showModifySetImage()}>
          <ModifySVG className="feature" />
        </div>
        <div style={shareStyle} onClick={() => handleClickButton({type: 'downloadshare', subtype: 'jpeg'})}>
          <ShareSVG className="feature"/>
        </div>
        {admin && <div style={shareStyle} onClick={() => handleClickButton({type: 'downloadshare', subtype: 'png'})}>
          <ShareContour/>
        </div>}
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
            <div className="wrapper-icon-sliders">
              <ResolutionSVG style={shareStyle}></ResolutionSVG>
            </div> 
            <Slider value={valueResolution} onChange={handleChangeValueResolution} />
          </div>
          <div className="wrapper-sub-buttons slider-width">
            <div className="wrapper-icon-sliders">
              <FilterSVG style={shareStyle}></FilterSVG>
            </div> 
            <Slider value={valueFilter} onChange={handleChangeValueFilter} />
          </div>
          <div className="wrapper-sub-buttons colors-background">
            {returnsColors()}
          </div>
          <div className="wrapper-sub-buttons wrapper-images">
            {returnImages()}
            {imageLoading && additionalImages}
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