import '../App.css';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import image1 from '../assets/images/image1.jpg'
import {ReactComponent as ArrowLeft} from '../assets/images/arrowLeftSimplified20.svg'
import utils from '../utils/utils.js'
import logUtils from '../utils/logUtils.js';
import ButtonImage from './ButtonImage.js'
import Modal from './Modal.js'
import Loader from './Loader.js'
import { vocabulary/**, languages*/ } from '../config/vocabulary.js';
import saleforceApiUtils from '../services/salesforce.js';
import html2canvas from 'html2canvas';
import Selector from './Selector.js';
import dbInteractions from '../services/dbInteractions.js';
import apiUtils from '../utils/apiUtils.js';

function ImageComponent(props) {

  const {athlete, activity, club, admin, language, activityId, userId, visitId, handleBack/**, handleBubbleLanguage*/} = props

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [drawingHeight, setDrawingHeight] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(0);
  const [xCrop, setXCrop] = useState(0);
  const [yCrop, setYCrop] = useState(0);
  const [drawingColor, setDrawingColor] = useState('white');
  const [filterColor] = useState('white');
  const [ratio, setRatio] = useState('9:16');
  const [showTitle, setShowTitle] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [unitMeasureSelected, setUnitMeasureSelected] = useState('metric');
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showCalories, setShowCalories] = useState(false);
  const [textUp, setTextUp] = useState(false);
  const [altitudeVertical, setAltitudeVertical] = useState(false);
  const [imageSrc, setImageSrc] = useState(image1);
  const canvasRef = useRef(null)
  const modaldRef = useRef()
  const [valueResolution, setValueResolution] = useState(100);
  const [valueFilter, setValueFilter] = useState(0);
  const [modeSelected, setModeSelected] = useState(undefined);
  const [showMode1, setShowMode1] = useState(false);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  const [showMode4, setShowMode4] = useState(false);
  const [showMode5, setShowMode5] = useState(false);
  const [showMode6, setShowMode6] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [imageToShare, setImagetoShare] = useState(null)
  const [isLoading/**, setIsLoading*/] = useState(false)
  // const [blendMode, setBlendMode] = useState('unset');
  const [infoLog, setInfoLog] = useState(saleforceApiUtils.inizializeInfo(athlete,activity))

  const styleText = showMode6 ? {
    color: drawingColor,
    top: '50%',
    transform: 'translateY(-50%)'
  } : {
    color: drawingColor,
    // mixBlendMode: blendMode,
  }
  const styleTextTitle = {
    color: drawingColor,
    width: '100%',
    // mixBlendMode: blendMode,
  }
  const filterStyle = {
    opacity: valueFilter/100
  }
  const styleLogoClub = {
    width: (ratio === '1:1') ? '10vw' : '15vw',
    height: (ratio === '1:1') ? '8vw' : '12vw',
    fill: drawingColor,
    // mixBlendMode: blendMode
  }
  const styleTextUnderSketch = {
    top: (ratio === '1:1') ? '82%' : '82%',
    color: drawingColor,
    // mixBlendMode: blendMode
  }

  const classesForLogoClub = () => {
    let result = 'logo-club-wrapper-scale'
    if(showMode3) {
      if(!altitudeVertical) {
        if(ratio === '1:1') return result + ' logo-club-wrapper-mode-3'
        else return result + ' logo-club-wrapper-mode-3-rect'
      } else {
        if(ratio === '1:1') return result + ' logo-club-wrapper-mode-3-vertical'
        else return result + ' logo-club-wrapper-mode-3-vertical-rect'
      }
    } else if(showMode5 && !textUp) {
      if(ratio === '1:1') return result + ' logo-club-wrapper-mode-5-down'
      else return result + ' logo-club-wrapper-mode-5-down-rect'
    } else {
      if(ratio === '1:1') return result + ' logo-club-wrapper'
      else return result + ' logo-club-wrapper-rect'
    }
  }

  const classesForSketch = () => {
    let result = 'round-corner canvas-position canvas-filter'
    if(showMode3 || showMode4) {
      if(ratio === '1:1') return result + ' canvas-sketch-mode-3'
      else return result + ' canvas-sketch-mode-3-rect'
    } else if(showMode5) {
      if(textUp) {
        if(ratio === '1:1') return result + ' canvas-sketch-mode-5'
        else return result + ' canvas-sketch-mode-5-rect'
      } else {
        if(ratio === '1:1') return result + ' canvas-sketch-mode-5-down'
        else return result + ' canvas-sketch-mode-5-down-rect'
      }
    } else {
      if(ratio === '1:1') return result + ' canvas-sketch'
      else return result + ' canvas-sketch-rect'
    }
  }
  const classesForName = () => {
    if(showMode5) {
      let result = 'text-overlay text-title-props-mode-5 text-name-props'
      if(textUp) {
        if(ratio === '1:1') return result + ' text-title-props-mode-5-up'
        else return result + ' text-title-props-mode-5-up-rect'
      } else {
        if(ratio === '1:1') return result + ' text-title-props-mode-5-down'
        else return result + ' text-title-props-mode-5-down-rect'
      }
    } else {
      if(ratio === '1:1') return ('text-overlay text-title-props text-name-props')
      else return ('text-overlay text-title-props-rect text-name-props')
    }
  }
  const classesForMode5 = () => {
    let result = 'width-left-mode-5 text-overlay-mode-5'
    if(textUp) {
      if(ratio === '1:1') {
        return (result + ' position-mode-5-up')
      } else {
        return (result + ' position-mode-5-up-rect')
      }
    } else {
      if(ratio === '1:1') {
        return (result + ' position-mode-5-down')
      } else {
        return (result + ' position-mode-5-down-rect')
      }
    }
  }
  const classesForDataElement = () => {
    if(showMode6) {
      return 'wrapper-data-element-mode-6'
    } else {
      if(ratio === '1:1') return 'wrapper-data-element'
      else return 'wrapper-data-element-rect'
    }
  }
  const classesCanvasContainer = ratio === '1:1' ? 'width-general canvas-container-general canvas-container-square round-corner' : 'canvas-container-general canvas-container-rect round-corner'
  const classesName = classesForName()
  const classesDate = ratio === '1:1' ? 'text-overlay text-title-props text-date-props' : 'text-overlay text-title-props-rect text-date-props'
  const classesModeStandard = ratio === '1:1' ? 'text-overlay text-coordinates-props' : 'text-overlay text-coordinates-props text-coordinates-props-rect'
  const classesSketch = classesForSketch()
  const classesDataWrapper2Lines = ratio === '1:1' ? 'width-general wrapper-data-2-lines' : 'width-general wrapper-data-2-lines-rect'
  const classesDataWrapper3Lines = ratio === '1:1' ? 'width-general wrapper-data-2-lines' : 'width-general wrapper-data-2-lines-rect'
  const classesDataWrapperLine = 'width-general wrapper-data-line'
  const classesDataElement = classesForDataElement()
  const classesDataPLittle = 'data-p-little'
  const classesLogoClub = classesForLogoClub()
  const classMode3 = ratio === '1:1' ? 'position-mode-3 text-overlay-mode-3 text-overlay-mode-3-dimention mode-3-text' : 'position-mode-3-rect text-overlay-mode-3 text-overlay-mode-3-dimention-rect mode-3-text-rect'
  const classMode3Vertical = ratio === '1:1' ? 'position-mode-3-vertical text-overlay-mode-3-vertical mode-3-vertical-text' : 'position-mode-3-vertical-rect text-overlay-mode-3-vertical mode-3-vertical-text-rect'
  const classMode5 = classesForMode5()
  const classWrapperMode5 = ratio === '1:1' ? 'wrapper-element-mode-5' : 'wrapper-element-mode-5'

  const insertLogsModal = async (data) => {
    let body = data.body
    dbInteractions.createRecordNonEditable('logs', process.env.REACT_APP_JWT_TOKEN, body)
  }

  const setLoadedModal = useCallback((bj,bp) => {
    console.log('bj', bp)
    console.log('bj', bj)
    if(!bj && !bp) insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,'Exception: no blob from ImageComponent',JSON.stringify(infoLog),'Imagecomponent','setLoadedModal','exception')})
    if(modaldRef.current) modaldRef.current.loaded(bj,bp)
  },[
    infoLog,
    visitId
  ])

  const pregenerateImagePng = useCallback((bj, anchor, scale) => {
    addOpacity()
    html2canvas(anchor, {
      backgroundColor:null,
      scale: scale ? scale : 10
    }).then((canvas) => {
      canvas.toBlob(function(blob) {
        if(!blob) {
          insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,'Excpetion: blob null from canvas.toBlob for png',JSON.stringify(infoLog),'Imagecomponent','pregenerateImagePng','exception')})
          pregenerateImagePng(bj, anchor, 2)
        } else {
          setLoadedModal(bj,blob)
        }
      }, 'image/png');
    })
    .catch((e) => {
      console.error('Error:', e)
      insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,e,JSON.stringify(infoLog),'Imagecomponent','pregenerateImagePng','exception')})
    })
    .finally(() => {
      removeOpacity()
      addRoundCorner()
    })
  },[
    infoLog,
    visitId,
    setLoadedModal
  ])

  const pregenerateImageJpeg = useCallback((scale) => {
    let anchor = document.getElementById('printingAnchor')
    removeRoundCorner()
    logUtils.loggerText('anchor', anchor)
    html2canvas(anchor, {
      backgroundColor: null,
      scale: scale ? scale : 10
    }).then((canvas) => {
      canvas.toBlob(function(blob) {
        if(!blob) {
          insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,'Excpetion: blob null from canvas.toBlob for jpeg',JSON.stringify(infoLog),'Imagecomponent','pregenerateImageJpeg','exception')})
          pregenerateImageJpeg(2)
        } else {
          pregenerateImagePng(blob, anchor, scale ? scale : undefined)
        }
      }, 'image/jpeg');
    })
    .catch((e) => {
      console.error('Error:', e)
      insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,e,JSON.stringify(infoLog),'Imagecomponent','pregenerateImageJpeg','exception')})
    })
  },[
    pregenerateImagePng,
    infoLog,
    visitId
  ])

  const handleDownloadShare = (type) => {
    openModal()
    pregenerateImageJpeg()
  }

  // const fetchImage = useCallback(async () => {
  //   const imageUrl = activity.photoUrl;
  //   const proxyUrl = window.location.origin + `/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  //   // const proxyUrl = `http:localhost:3000/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  
  //   const response = await fetch(proxyUrl);
  //   logUtils.loggerText('response: ', response)
  //   const blob = await response.blob();
  //   const imageObjectURL = URL.createObjectURL(blob);
    
  //   // Set the image source in your app (for example, in an img element)
  //   activity['photoUrlProxied'] = imageObjectURL.replace('blob:','');
  //   logUtils.loggerText('activity: ', activity)
  // },[
  //   activity
  // ]);

  const removeRoundCorner = () => {
    const canvasImageElement = document.getElementById('canvasImage')
    const canvasFilterElement = document.getElementById('canvasFilter')
    const canvasSketchElement = document.getElementById('canvasSketch')
    const canvasAnchorElement = document.getElementById('printingAnchor')
    if(canvasImageElement) canvasImageElement.classList.remove('round-corner')
    if(canvasFilterElement) canvasFilterElement.classList.remove('round-corner')
    if(canvasSketchElement) canvasSketchElement.classList.remove('round-corner')
    if(canvasAnchorElement) canvasAnchorElement.classList.remove('round-corner')
  }
  const addRoundCorner = () => {
    const canvasImageElement = document.getElementById('canvasImage')
    const canvasFilterElement = document.getElementById('canvasFilter')
    const canvasSketchElement = document.getElementById('canvasSketch')
    const canvasAnchorElement = document.getElementById('printingAnchor')
    if(canvasImageElement) canvasImageElement.classList.add('round-corner')
    if(canvasFilterElement) canvasFilterElement.classList.add('round-corner')
    if(canvasSketchElement) canvasSketchElement.classList.add('round-corner')
    if(canvasAnchorElement) canvasAnchorElement.classList.add('round-corner')
  }
  const addOpacity = () => {
    const canvasImageElement = document.getElementById('canvasImage')
    const canvasAnchorElement = document.getElementById('printingAnchor')
    if(canvasImageElement) canvasImageElement.classList.add('background-opacity')
    if(canvasAnchorElement) canvasAnchorElement.classList.add('background-trasparency')
  }
  const removeOpacity = () => {
    const canvasImageElement = document.getElementById('canvasImage')
    const canvasAnchorElement = document.getElementById('printingAnchor')
    if(canvasImageElement) canvasImageElement.classList.remove('background-opacity')
    if(canvasAnchorElement) canvasAnchorElement.classList.remove('background-trasparency')
  }

  // const returnImage = useCallback(() => {
  //   removeRoundCorner()
  //   let anchor = document.getElementById('printingAnchor')

  //   toJpeg(anchor, { quality: 0.95, width: anchor.offsetWidth, height: anchor.offsetHeight })
  //     .then((dataUrl) => {
  //       seeImage()
  //       setImagetoShare(dataUrl)
  //       setIsLoading(false)
  //     })
  //     .catch((error) => {
  //       console.error('oops, something went wrong!', error);
  //     })
  //     .finally(() => {
  //       addRoundCorner()
  //     })
  // },[])

  const transformCoordinates = (coord, zoomFactor, width, height, mapCenter) => {
    return [(coord[0] - mapCenter[0]) * zoomFactor + width / 2, - (coord[1] - mapCenter[1]) * zoomFactor + height / 2]
  }

  const drawElevation = useCallback((color, canvasWidth, canvasHeight, resolutionChanging, mode4Enabled) => {
    try {
      let canvasSketch = document.getElementById('canvasSketch')
      if(!canvasSketch) {
        setTimeout(() => drawElevation(color, canvasWidth, canvasHeight, resolutionChanging, mode4Enabled), 100)
        return
      }
      if((!activity.altitudeStream || (activity.altitudeStream && !activity.altitudeStream.length)) ||
        (!activity.distanceStream || (activity.distanceStream && !activity.distanceStream.length))) return
      // let canvasSketchWidth = (canvasWidth ? canvasWidth : canvasSketch.getBoundingClientRect().width) * 5
      // let canvasSketchHeight = (canvasHeight ? canvasHeight : canvasSketch.getBoundingClientRect().height) * 5
      let canvasSketchWidth = 500 * 10
      let canvasSketchHeight = ratio.split(':')[1] / ratio.split(':')[0] * 500 * 10
      let altitudeStream = activity.altitudeStream
      let distanceStream = activity.distanceStream
      let width = Math.min(canvasSketchHeight, canvasSketchWidth) * 10
      let height = canvasSketchHeight * 10
      setDrawingWidth(width)
      setDrawingHeight(canvasSketchHeight)
      let ctx = canvasSketch.getContext('2d')
      // Setup line properties to avoid spikes
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
  
      let maxAltitude = Math.max(...altitudeStream)
      let minAltitude = Math.min(...altitudeStream)
  
      let altitudeGap = maxAltitude - minAltitude
  
      logUtils.loggerText('width:', width)
      logUtils.loggerText('height:', height)
      logUtils.loggerText('altitudeStream:', altitudeStream)
      logUtils.loggerText('maxAltitude:', maxAltitude)
      logUtils.loggerText('minAltitude:', minAltitude)
      logUtils.loggerText('altitudeGap:', altitudeGap)
      console.log('mode4Enabled from drawElevation:', mode4Enabled)
      if(!mode4Enabled) ctx.clearRect(0, 0, width, height);
  
      ctx.strokeStyle = color 
      ctx.lineWidth = width * 0.005
      let lengthDistance = distanceStream.length
      let ratioForResolution = Math.round(lengthDistance / 125)
      let resolutionPercentage = resolutionChanging ? resolutionChanging : ( valueResolution ? valueResolution : setValueResolution(lengthDistance))
      let resolutionUsing = (resolutionPercentage / 100) * lengthDistance / ratioForResolution
      ctx.beginPath()
    
      let zoomFactorY = (height * 0.30)/altitudeGap
      let zoomFactorX = width/distanceStream[lengthDistance - 1]
      logUtils.loggerText('zoomFactorY:', zoomFactorY)
      logUtils.loggerText('Math.floor(lengthDistance/500):', Math.floor(lengthDistance/10))
  
      for(let i = 0; i < altitudeStream.length; i++) {
        if(i % Math.floor(lengthDistance/resolutionUsing) === 0) {
          let aY = height - ((altitudeStream[i] - minAltitude * 0.9) * zoomFactorY)
          let aX = distanceStream[i] * zoomFactorX
          ctx.lineTo(aX,aY)
        }
      }
      logUtils.loggerText('altitudeStream[0] * zoomFactorY:', altitudeStream[0] * zoomFactorY)
      logUtils.loggerText('distanceStream[0] * zoomFactorY:', distanceStream[0] * zoomFactorX)
      
      ctx.lineTo(width,height - ((altitudeStream[altitudeStream.length - 1] - minAltitude * 0.9) * zoomFactorY))
      ctx.lineTo(width,height)
      ctx.lineTo(0,height)
      ctx.lineTo(0,height - (altitudeStream[0] * zoomFactorY))
      ctx.fillStyle = color
      ctx.closePath()
      ctx.fill()
      // requestAnimationFrame(() => {
      //   pregenerateImageJpeg();
      // });
      // let climbs = returnClimbing(altitudeStream, distanceStream)
      // for(let i = 0; i < climbs.length; i++) {
      //   let climb = climbs[i]
      //   ctx.beginPath()
      //   ctx.strokeStyle = color
      //   ctx.lineTo(distanceStream[climb.indexStart] * zoomFactorX,height * 0.4)
      //   ctx.lineTo(distanceStream[climb.indexStart] * zoomFactorX, height - ((altitudeStream[climb.indexStart] - minAltitude * 0.9) * zoomFactorY) - 10)
      //   ctx.stroke()
      //   ctx.beginPath()
      //   ctx.strokeStyle = brandingPalette.secondary
      //   ctx.lineTo(distanceStream[climb.indexFinish] * zoomFactorX,height * 0.4)
      //   ctx.lineTo(distanceStream[climb.indexFinish] * zoomFactorX, height - ((altitudeStream[climb.indexFinish] - minAltitude * 0.9) * zoomFactorY) - 10)
      //   ctx.stroke()
      // }
    } catch (e) {
      console.log('e', e)
      insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,'Exception:' + String(e),JSON.stringify(infoLog),'Imagecomponent','drawElevation','exception')})
    }
  },[
    activity.altitudeStream,
    activity.distanceStream,
    ratio,
    valueResolution,
    infoLog,
    visitId
    // pregenerateImageJpeg
  ])

  const drawLine = useCallback((color, canvasWidth, canvasHeight, resolutionChanging, mode4Enabled) => {
    try {
      let canvasSketch = document.getElementById('canvasSketch')
      if(!canvasSketch) {
        setTimeout(() => drawLine(color, canvasWidth, canvasHeight, resolutionChanging, mode4Enabled),100)
        return
      }
      if(!activity.coordinates || (activity.coordinates && !activity.coordinates.length)) return
      // let canvasSketchWidth = (canvasWidth ? canvasWidth : canvasSketch.getBoundingClientRect().width) * 5
      // let canvasSketchHeight = (canvasHeight ? canvasHeight : canvasSketch.getBoundingClientRect().height) * 5
      let canvasSketchWidth = 500 * 10
      let canvasSketchHeight = 500 * 10
      canvasSketchWidth = 500 * 10
      canvasSketchHeight = 500 * 10
      let coordinates = activity.coordinates
      let width = Math.min(canvasSketchHeight, canvasSketchWidth)
      let height = Math.min(canvasSketchHeight, canvasSketchWidth)
      setDrawingHeight(width)
      setDrawingWidth(height)
      let ctx = canvasSketch.getContext('2d')
      // Setup line properties to avoid spikes
      ctx.lineJoin = 'round'; // Options: 'bevel', 'round', 'miter'
      ctx.lineCap = 'round';  // Options: 'butt', 'round', 'square'
      // let border = width*0.2
      // setThickness(width*0.01)

      let minX = Math.min(...coordinates.map(x => x[0]))
      let maxX = Math.max(...coordinates.map(x => x[0]))
      let minY = Math.min(...coordinates.map(x => x[1]))
      let maxY = Math.max(...coordinates.map(x => x[1]))
      
      let mapWidth = maxX - minX
      let mapHeight = maxY - minY
      let mapCenterX = (minX + maxX) / 2
      let mapCenterY = (minY + maxY) / 2
      let mapCenter = [mapCenterX, mapCenterY]

      let zoomFactor = Math.min(width / mapWidth, height / mapHeight) * (mode4Enabled ? 0.5 : 0.95)
      logUtils.loggerText('zoomFactor:', zoomFactor)
      console.log('mode4Enabled from drawLine:', mode4Enabled)
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = color 
      ctx.lineWidth = width * 0.01
      let lengthCoordinates = coordinates.length
      let ratioForResolution = Math.round(lengthCoordinates / 200)
      let resolutionPercentage = resolutionChanging ? resolutionChanging : ( valueResolution ? valueResolution : setValueResolution(lengthCoordinates))
      let resolutionUsing = (resolutionPercentage / 100) * lengthCoordinates / ratioForResolution
      console.log('lengthCoordinates', lengthCoordinates)
      // (lengthCoordinates * (resolutionPercentage / 100))/lengthCoordinates
      let scaleFactor = Number((lengthCoordinates * 0.05).toFixed(0))
      console.log('scaleFactor:', scaleFactor)
      let drawing = true
      let dimentionCircleStart = width * 0.005
      let dimentionCircleFinish = width * 0.02
      let endCoordinates = transformCoordinates(coordinates[lengthCoordinates - 1], zoomFactor, width, height, mapCenter)
      let startCoordinates = transformCoordinates(coordinates[0], zoomFactor, width, height, mapCenter)
      let dimentionCircleStartReal = utils.quadraticFunction(endCoordinates, startCoordinates) > (dimentionCircleFinish + dimentionCircleStart * 2) ** 2 ? (dimentionCircleStart * 2) : dimentionCircleStart
      let startCoordinatesReal = dimentionCircleStartReal > dimentionCircleStart ? startCoordinates : endCoordinates
      // stroke the initial circle only if the intersection it's null with the final circle
      drawCircle(ctx, startCoordinatesReal, dimentionCircleStartReal, true, color)
      // stroke the final circle
      drawCircle(ctx, endCoordinates, dimentionCircleFinish)
      // ctx.setLineDash([Number((lengthCoordinates * 0.003).toFixed(0)), Number((lengthCoordinates * 0.008).toFixed(0))]);
      ctx.beginPath()
    

      for(let i = 0; i < coordinates.length; i++) {
        // if(i>200) break
        let cd = transformCoordinates(coordinates[i], zoomFactor, width, height, mapCenter)
        // let cdMinus
        let cdPlus
        // if(coordinates[i - 1]) cdMinus = transformCoordinates(coordinates[i - 1], zoomFactor, width, height, mapCenter)
        if(coordinates[i + 1]) cdPlus = transformCoordinates(coordinates[i + 1], zoomFactor, width, height, mapCenter)
        if(i % Math.floor(lengthCoordinates/resolutionUsing) === 0) {
          if(utils.getOufCircle(cd, endCoordinates, dimentionCircleFinish, startCoordinates, dimentionCircleStart)) {
            if(!drawing) {
              drawing = true
              ctx.beginPath()
            }
            ctx.lineTo(cd[0],cd[1])
          } else {
            if(drawing) ctx.stroke()
            drawing = false
          }
        } else {
          if(!drawing && cdPlus && utils.comingOutsidePlus(cd, cdPlus, endCoordinates, dimentionCircleFinish, startCoordinates, dimentionCircleStart)) {
            drawing = true
            ctx.beginPath()
            ctx.lineTo(cdPlus[0],cdPlus[1])
          } 
          else if(drawing && cdPlus && utils.comingInsidePlus(cd, cdPlus, endCoordinates, dimentionCircleFinish, startCoordinates, dimentionCircleStart)) {
            ctx.lineTo(cd[0],cd[1])
            ctx.stroke()
            drawing = false
          }
        }
        // ctx.lineTo(cd[0],cd[1])
      }
      // stroke the path
      ctx.stroke()
      if(mode4Enabled) drawElevation(color, canvasWidth, canvasHeight, resolutionChanging, mode4Enabled)
      // if(club && club.name === 'dev-admin') returnImage()
      // requestAnimationFrame(() => {
      //   pregenerateImageJpeg();
      // });
    } catch (e) {
      console.log('e', e)
      insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,'Exception:' + String(e),JSON.stringify(infoLog),'Imagecomponent','drawLine','exception')})
    }
  },[
    activity.coordinates,
    valueResolution,
    drawElevation,
    visitId,
    infoLog
    // pregenerateImageJpeg
    // club,
    // returnImage
  ])

  const drawCircle = (ctx, coordinates, diameter, fill, color) => {
    ctx.beginPath()
    ctx.arc(coordinates[0], coordinates[1], diameter, 0, Math.PI * 2);
    ctx.stroke()
    if(fill) {
      ctx.fillStyle = color
      ctx.fill()
    }
  }

  const drawElevationVertical = useCallback((color, canvasWidth, canvasHeight, resolutionChanging) => {
    let canvasSketch = document.getElementById('canvasSketch')
    if(!canvasSketch) {
      setTimeout(() => drawElevationVertical(color, canvasWidth, canvasHeight, resolutionChanging),100)
      return
    }
    if((!activity.altitudeStream || (activity.altitudeStream && !activity.altitudeStream.length)) ||
      (!activity.distanceStream || (activity.distanceStream && !activity.distanceStream.length))) return
    // let canvasSketchWidth = (canvasWidth ? canvasWidth : canvasSketch.getBoundingClientRect().width) * 5
    // let canvasSketchHeight = (canvasHeight ? canvasHeight : canvasSketch.getBoundingClientRect().height) * 5
    let canvasSketchWidth = 500
    let canvasSketchHeight = ratio.split(':')[1] / ratio.split(':')[0] * 500
    let altitudeStream = activity.altitudeStream
    let distanceStream = activity.distanceStream
    let width = Math.min(canvasSketchHeight, canvasSketchWidth)
    let height = canvasSketchHeight
    setDrawingWidth(width)
    setDrawingHeight(canvasSketchHeight)
    let ctx = canvasSketch.getContext('2d')
    // Setup line properties to avoid spikes
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    let maxAltitude = Math.max(...altitudeStream)
    let minAltitude = Math.min(...altitudeStream)

    let altitudeGap = maxAltitude - minAltitude

    logUtils.loggerText('width:', width)
    logUtils.loggerText('height:', height)
    logUtils.loggerText('altitudeStream:', altitudeStream)
    logUtils.loggerText('maxAltitude:', maxAltitude)
    logUtils.loggerText('minAltitude:', minAltitude)
    logUtils.loggerText('altitudeGap:', altitudeGap)

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = color 
    ctx.lineWidth = width * 0.005
    let lengthDistance = distanceStream.length
    let lengthAltitude = altitudeStream.length
    let ratioForResolution = Math.round(lengthDistance / 250)
    let resolutionPercentage = resolutionChanging ? resolutionChanging : ( valueResolution ? valueResolution : setValueResolution(lengthDistance))
    let resolutionUsing = (resolutionPercentage / 100) * lengthDistance / ratioForResolution
    ctx.beginPath()
  
    let zoomFactorY = height/distanceStream[lengthDistance - 1]
    let zoomFactorX = (width * 0.4)/altitudeGap

    logUtils.loggerText('zoomFactorY:', zoomFactorY)
    logUtils.loggerText('Math.floor(lengthDistance/500):', Math.floor(lengthDistance/10))

    for(let i = 0; i < altitudeStream.length; i++) {
      if(i % Math.floor(lengthDistance/resolutionUsing) === 0) {
        let aX = width - ((altitudeStream[i] - minAltitude * 0.9) * zoomFactorX)
        let aY = height - distanceStream[i] * zoomFactorY
        ctx.lineTo(aX,aY)
      }
    }

    logUtils.loggerText('altitudeStream[0] * zoomFactorY:', altitudeStream[0] * zoomFactorY)
    logUtils.loggerText('distanceStream[0] * zoomFactorY:', distanceStream[0] * zoomFactorX)

    ctx.lineTo(width - ((altitudeStream[lengthAltitude - 1] - minAltitude * 0.9) * zoomFactorX),0)
    ctx.lineTo(width,0)
    ctx.lineTo(width,height)
    ctx.lineTo(width - (altitudeStream[0] * zoomFactorX),height)
    ctx.fillStyle = color
    ctx.closePath()
    ctx.fill()
    // requestAnimationFrame(() => {
    //   pregenerateImageJpeg();
    // });
    // let climbs = returnClimbing(altitudeStream, distanceStream)
    // for(let i = 0; i < climbs.length; i++) {
    //   let climb = climbs[i]
    //   ctx.beginPath()
    //   ctx.strokeStyle = color
    //   ctx.lineTo(distanceStream[climb.indexStart] * zoomFactorX,height * 0.4)
    //   ctx.lineTo(distanceStream[climb.indexStart] * zoomFactorX, height - ((altitudeStream[climb.indexStart] - minAltitude * 0.9) * zoomFactorY) - 10)
    //   ctx.stroke()
    //   ctx.beginPath()
    //   ctx.strokeStyle = brandingPalette.secondary
    //   ctx.lineTo(distanceStream[climb.indexFinish] * zoomFactorX,height * 0.4)
    //   ctx.lineTo(distanceStream[climb.indexFinish] * zoomFactorX, height - ((altitudeStream[climb.indexFinish] - minAltitude * 0.9) * zoomFactorY) - 10)
    //   ctx.stroke()
    // }
  },[
    activity.altitudeStream,
    activity.distanceStream,
    ratio,
    valueResolution,
    // pregenerateImageJpeg
  ])

  // const returnClimbing = (altitudeStream, distanceStream) => {
  //   let asl = altitudeStream.length
  //   let dsl = distanceStream.length
  //   altitudeStream = altitudeStream.map(x => Math.floor(x))
  //   distanceStream = distanceStream.map(x => Math.floor(x))
  //   logUtils.loggerText('altitudeStream:', altitudeStream)
  //   let climbs = []
  //   for(let i = 0; i < asl - 1; i++) {
  //     let climb = {
  //       distance: undefined,
  //       gradient: undefined,
  //       elevation: undefined,
  //       maxElevation: undefined,
  //       minElevation: undefined,
  //       start: distanceStream[i],
  //       finish: undefined,
  //       indexStart: i,
  //       indexFinish: i
  //     }
      
  //     for(let j = i + 1; j < asl; j++) {
  //       if(altitudeStream[j] - altitudeStream[j - 1] < 0 && distanceStream[j] - distanceStream[i] > 0) {
  //         climb.distance = distanceStream[j] - distanceStream[i]
  //         climb.elevation = altitudeStream[j] - altitudeStream[i]
  //         climb.maxElevation = altitudeStream[j]
  //         climb.minElevation = altitudeStream[i]
  //         climb.gradient = utils.returnGradient(climb.distance,climb.elevation)
  //         climb.finish = distanceStream[j]
  //         climb.indexFinish = j
  //         climbs.push(climb)
  //         i = j + 1
  //         break
  //       }
  //     }
  //   }
  //   logUtils.loggerText('climbs:', climbs)
  //   climbs = climbs.filter(x => x.gradient > 0)
  //   let finalClimbs = []
  //   if(climbs) finalClimbs.push(climbs[0])
  //   for(let i = 1; i < climbs.length; i++) {
  //     let previousClimb = finalClimbs[finalClimbs.length - 1]
  //     let tempClimb = climbs[i]
  //     if(tempClimb.start - previousClimb.finish < tempClimb.distance * 0.1 
  //       || tempClimb.start - previousClimb.finish < previousClimb.distance * 0.1) {
  //         finalClimbs[finalClimbs.length - 1] = {
  //           distance: tempClimb.finish - previousClimb.start,
  //           gradient: undefined,
  //           elevation: tempClimb.maxElevation - previousClimb.minElevation,
  //           maxElevation: tempClimb.maxElevation,
  //           minElevation: previousClimb.minElevation,
  //           start: previousClimb.start,
  //           finish: tempClimb.finish,
  //           indexStart: previousClimb.indexStart,
  //           indexFinish: tempClimb.indexFinish
  //         }
  //         finalClimbs[finalClimbs.length - 1].gradient = utils.returnGradient(finalClimbs[finalClimbs.length - 1].distance, finalClimbs[finalClimbs.length - 1].elevation)
  //       } else {
  //         finalClimbs.push(tempClimb)
  //       }
  //   }
  //   finalClimbs = finalClimbs.filter(x => x.distance > (distanceStream[dsl - 1] * 0.01) && x.gradient > 0.03)
  //   logUtils.loggerText('finalClimbs:', finalClimbs)
  //   return finalClimbs
  // }

  const drawFilter = useCallback((width, height) => {
    // if(club && club.name === 'dev-admin') seeHiding()
    let widthToUse = width ? width : canvasWidth
    let heightToUse = height ? height : canvasHeight
    let canvasFilter = document.getElementById('canvasFilter')
    let ctx = canvasFilter.getContext('2d')
    ctx.clearRect(0, 0, widthToUse, heightToUse)
    ctx.fillStyle = filterColor
    ctx.fillRect(0, 0, widthToUse, heightToUse);
    // if(club && club.name === 'dev-admin') returnImage()
  }, [
    filterColor, 
    canvasWidth, 
    canvasHeight,
    // returnImage,
    // club
  ])

  const handleClickDispatcher = (data) => {
    logUtils.loggerText('handleClickDispatcher:', data)
    if(data.type === 'downloadshare') {
      handleDownloadShare(data.subtype)
    } else
    if(data.type === 'filterSlider') {
      infoLog.filter = String(data.value)
      setValueFilter(data.value)
      drawFilter()
    }
    else if(data.type === 'resolutionSlider') {
      infoLog.resolution = String(data.value)
      setValueResolution(data.value)
      if(showMode3) {
        if(!altitudeVertical) drawElevation(drawingColor, canvasWidth, canvasHeight, data.value)
        else drawElevationVertical(drawingColor, canvasWidth, canvasHeight, data.value)
      } else if(showMode1 || showMode2 || showMode4 || showMode5) drawLine(drawingColor, canvasWidth, canvasHeight, data.value)
    }
    // else if(data.type === 'share') handleDownloadClick()
    // else if(data.type === 'share-contour') handleDownloadClick('contour')
    // else if(data.type === 'blend-mode') handleBlendMode(data.blendMode)
    else if(data.type === 'changing-color') handleColorChange(data.color)
    else if(data.type === 'rectangle' || data.type === 'square' || data.type === 'twice') {
      let ratioText = '9:16'
      infoLog.size = data.type
      switch (data.type) {
        case 'square':
          ratioText = '1:1'
          break
        case 'twice':
          ratioText = '2:1'
          break
        default:
          ratioText = '9:16'
      }
      setRatio(ratioText)
      handleCrop(ratioText, imageSrc)
    } else if(data.type === 'show-hide') {
      if(data.subtype === 'name') {
        infoLog.showname = !infoLog.showname
        infoLog.showdate = true
        setShowTitle(data.show)
        setShowDate(data.show)
      } else if(data.subtype === 'date') {
        infoLog.showdate = !infoLog.showdate
        setShowDate(data.show)
      } else if(data.subtype === 'distance') {
        infoLog.showdistance = !infoLog.showdistance
        setShowDistance(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'duration') {
        infoLog.showduration = !infoLog.showduration
        setShowDuration(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'elevation') {
        infoLog.showelevation = !infoLog.showelevation
        setShowElevation(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'average') {
        infoLog.showaverage = !infoLog.showaverage
        setShowAverage(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'power') {
        infoLog.showpower = !infoLog.showpower
        setShowPower(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'coordinates') {
        infoLog.showcoordinates = !infoLog.showcoordinates
        setShowCoordinates(data.show)
        if(data.show) {
          enableMode1(false, false)
        }
      } else if(data.subtype === 'mode1') {
        setInfoLog(saleforceApiUtils.setMode1(infoLog))
        setShowMode1(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode1(data.show, true, data.start)
        }
        // if(data.show) enableMode1(true, false, data.start)
      } else if(data.subtype === 'mode2') {
        setInfoLog(saleforceApiUtils.setMode2(infoLog))
        setShowMode2(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode2(data.start)
        }
      } else if(data.subtype === 'mode3') {
        setInfoLog(saleforceApiUtils.setMode4(infoLog))
        setShowMode3(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode3(data.start)
        }
      } else if(data.subtype === 'mode4') {
        setInfoLog(saleforceApiUtils.setMode4(infoLog))
        setShowMode4(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode4(data.start)
        }
      } else if(data.subtype === 'mode5') {
        setInfoLog(saleforceApiUtils.setMode5(infoLog))
        setShowMode5(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode5(data.start)
        }
      } else if(data.subtype === 'mode6') {
        setInfoLog(saleforceApiUtils.setMode6(infoLog))
        setShowMode6(data.show)
        if(data.show) {
          setFalseOthermode(data)
          enableMode6(data.start)
        }
      }
    } else if(data.type === 'switch-text') {
      setTextUp(data.textUp)
    } else if(data.type === 'switch-altitude') {
      setAltitudeVertical(data.altitudeVertical)
      drawElevationVertical(drawingColor, canvasWidth, canvasHeight)
    } else if(data.type === 'image') {
      infoLog.image = data.info
      setImage(data.image)
    } else if(data.type === 'unit') {
      infoLog.unit = data.unit
      setUnitMeasureSelected(data.unit)
    }
  }

  const setFalseOthermode = (data) => {
    if(data.subtype !== 'mode1') setShowMode1(!data.show)
    if(data.subtype !== 'mode2') setShowMode2(!data.show)
    if(data.subtype !== 'mode3') setShowMode3(!data.show)
    if(data.subtype !== 'mode4') setShowMode4(!data.show)
    if(data.subtype !== 'mode5') setShowMode5(!data.show)
    if(data.subtype !== 'mode6') setShowMode6(!data.show)
  }

  const enableMode1 = (bool, isStart, start) => {
    if(!start) drawLine(drawingColor, canvasWidth, canvasHeight)
    if(isStart) {
      setShowTitle(bool)
      setShowDate(bool)
    }
    setShowDistance(bool)
    setShowElevation(bool)
    setShowDuration(bool)
    setShowPower(bool)
    setShowAverage(bool)
    setShowCoordinates(!bool)
  }

  const enableMode2 = (start) => {
    if(!start) drawLine(drawingColor, canvasWidth, canvasHeight)
    setShowTitle(true)
    setShowDate(true)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }

  const enableMode3 = (start) => {
    if(!start) {
      if(!altitudeVertical) drawElevation(drawingColor, canvasWidth, canvasHeight)
      else drawElevationVertical(drawingColor, canvasWidth, canvasHeight)
    }
    setShowTitle(false)
    setShowDate(false)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    setShowCoordinates(true)
  }

  const enableMode4 = (start) => {
    if(!start) {
      drawLine(drawingColor, canvasWidth, canvasHeight, undefined, true)
    }
    setShowTitle(false)
    setShowDate(false)
    // setShowDistance(true)
    // setShowElevation(true)
    // setShowDuration(true)
    // setShowPower(true)
    // setShowAverage(true)
    // setShowCoordinates(true)
  }

  const enableMode5 = (start) => {
    if(!start) drawLine(drawingColor, canvasWidth, canvasHeight)
    setShowTitle(true)
    setShowDate(false)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }
  const enableMode6 = (start) => {
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    setShowCalories(true)
  }

  const handleColorChange = (color) => {
    infoLog.color = color
    console.info('color to set:', color)
    setDrawingColor(color)
    if(showMode3) {
      if(!altitudeVertical) drawElevation(drawingColor, canvasWidth, canvasHeight)
      else drawElevationVertical(drawingColor, canvasWidth, canvasHeight)
    } else if(showMode1 || showMode2 || showMode4 || showMode5) drawLine(drawingColor, canvasWidth, canvasHeight, undefined, showMode4)
    drawFilter()
  }

  // const handleBlendMode = (blendModeSetting) => {
  //   logUtils.loggerText('Blend mode to set:', blendModeSetting)
  //   if(drawingColor === '#000000' || (showMode3 && drawingColor === '#282c34')) {
  //     handleColorChange(brandingPalette.primary)
  //   } else {
  //     if(showMode3) drawElevation(drawingColor, canvasWidth, canvasHeight)
  //     else if(showMode4) drawElevationVertical(drawingColor, canvasWidth, canvasHeight)
  //     else drawLine(drawingColor, canvasWidth, canvasHeight)
  //     drawFilter()
  //   }
  //   setBlendMode(blendModeSetting)
  // }

  const handleCrop = useCallback((ratioText, imgSrc) => {
    if(!modeSelected) return
    logUtils.loggerText('Ratio text:', ratioText)
    if(!imgSrc) imgSrc = image1
    const imageReference = new Image()
    imageReference.onload = () => {
      let imageReferenceWidth = imageReference.width
      let imageReferenceHeight = imageReference.height

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      let ratioParts = ratioText.split(':')
      const aspectRatio = parseInt(ratioParts[0], 10) / parseInt(ratioParts[1], 10)
      let canvasWidth, canvasHeight, xCropTemp, yCropTemp
      
      if (imageReferenceWidth / imageReferenceHeight > aspectRatio) {
        // Image is wider than the target ratio
        canvasHeight = imageReferenceHeight;
        canvasWidth = canvasHeight * aspectRatio;
        xCropTemp = (imageReferenceWidth - canvasWidth) / 2;
        yCropTemp = 0;
      } else {
        // Image is taller than the target ratio
        canvasWidth = imageReferenceWidth;
        canvasHeight = canvasWidth / aspectRatio;
        xCropTemp = 0;
        yCropTemp = (imageReferenceHeight - canvasHeight) / 2;
      }
      
      let scaleFactorWidth = 1
      let scaleFactorHeight = 1
      // Scale the canvas and cropping dimensions by half
      if(canvasWidth > 2000 || canvasHeight > 2000) {
        if(canvasWidth > canvasHeight) {
          scaleFactorWidth = canvasWidth / 3000
          scaleFactorHeight = scaleFactorWidth
        } else {
          scaleFactorHeight = canvasHeight / 3000
          scaleFactorWidth = scaleFactorHeight
        }
      }

      canvasWidth *= 1 / scaleFactorWidth;
      canvasHeight *= 1 / scaleFactorHeight;
      xCropTemp *= 1 / scaleFactorWidth;
      yCropTemp *= 1 / scaleFactorHeight;

      setXCrop(xCropTemp);
      setYCrop(yCropTemp);
      setCanvasWidth(canvasWidth);
      setCanvasHeight(canvasHeight);

      // Clear the canvas and draw the image scaled down
      logUtils.loggerText('canvas.width', canvas.width)
      logUtils.loggerText('canvas.height', canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageReference, xCrop, yCrop, canvasWidth * scaleFactorHeight, canvasHeight * scaleFactorWidth, 0, 0, canvasWidth, canvasHeight);
      drawFilter(canvasWidth, canvasHeight);

      if(showMode3) {
        if(!altitudeVertical) drawElevation(drawingColor, canvasWidth, canvasHeight)
        else drawElevationVertical(drawingColor, canvasWidth, canvasHeight)
      } else if(showMode1 || showMode2 || showMode4 || showMode5) drawLine(drawingColor, canvasWidth, canvasHeight, undefined, showMode4);
  };

    // Important: Set src after defining onload to ensure it is loaded before drawing
    imageReference.src = imgSrc;
  }, [
    drawFilter,
    drawingColor,
    drawLine,
    drawElevation,
    drawElevationVertical,
    showMode1,
    showMode2,
    showMode3,
    showMode4,
    showMode5,
    altitudeVertical,
    xCrop,
    yCrop,
    modeSelected
  ])

  const setImage = (newImage) => {
    // if(club && club.name === 'dev-admin') {
    //   setIsLoading(true)
    //   seeHiding()
    // }
    setImageSrc(newImage)
    handleCrop(ratio, newImage)
  }

  const returnMode1Disposition = () => {
    let line1 = []
    let line2 = []
    let dataShowing = []
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataShowing.push(<div key="distance" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_DISTANCE}</p><p>{activity[unitMeasureSelected].beautyDistance}</p></div>)
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataShowing.push(<div key="elevation" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_ELEVATION}</p><p>{activity[unitMeasureSelected].beautyElevation}</p></div>)
    if(activity.beautyDuration && showDuration) dataShowing.push(<div key="duration" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_DURATION}</p><p>{activity.beautyDuration}</p></div>)
    if(activity.beautyPower && showPower) dataShowing.push(<div key="power" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_POWER}</p><p>{activity.beautyPower}</p></div>)
    if(activity[unitMeasureSelected].beautyAverage && showAverage) dataShowing.push(<div key="average" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_AVERAGE}</p><p>{activity[unitMeasureSelected].beautyAverage}</p></div>)
    if(dataShowing.length <= 3) {
      line1.push(...dataShowing)
    } else if(dataShowing.length === 4) {
      line1.push(...dataShowing.slice(0,2))
      line2.push(...dataShowing.slice(2,4))
    } else {
      line1.push(...dataShowing.slice(0,3))
      line2.push(...dataShowing.slice(3))
    }
    let elementToDisplayNormal = !line1.length ? <div></div> : (line2.length) ? <div id="canvasText" style={styleText} className={classesDataWrapper2Lines}>{line1.length && <div className={classesDataWrapperLine}>{line1}</div>}{line2.length && <div className={classesDataWrapperLine}>{line2}</div>}</div> : <div id="canvasText" style={styleText} className={classesDataWrapper2Lines}>{line1.length && <div className={classesDataWrapperLine}>{line1}</div>}</div>
    let elementToDisplayCoord = <div id="canvasText" style={styleTextUnderSketch} className={classesModeStandard}>{activity.beautyCoordinates}</div>
    let elementToReturn = (activity.beautyCoordinates && showCoordinates) ? elementToDisplayCoord : elementToDisplayNormal
    return(<div>{elementToReturn}</div>)
  }

  const returnMode2Disposition = () => {
    let dataDisplaying = ''
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataDisplaying += activity[unitMeasureSelected].beautyDistance
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataDisplaying += (dataDisplaying.length ? ' x ' : '') + activity[unitMeasureSelected].beautyElevation
    if(activity.beautyDuration && showDuration) dataDisplaying += (dataDisplaying.length ? ' x ' : '') + activity.beautyDuration
    return(<div id="canvasText" style={styleTextUnderSketch} className={classesModeStandard}>{dataDisplaying}</div>)
  }

  const returnMode3Disposition = () => {
    let dataDisplaying = []
    if(!altitudeVertical) {

      if(activity[unitMeasureSelected].beautyDistance && showDistance) dataDisplaying.push(<div key="distance" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyDistance}</p></div>)
      if(activity[unitMeasureSelected].beautyElevation && showElevation) dataDisplaying.push(<div key="elevation" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyElevation}</p></div>)
      if(activity.beautyDuration && showDuration) dataDisplaying.push(<div key="duration" className="element-mode-3"><p>{activity.beautyDuration}</p></div>)
      if(activity.beautyPower && showPower) dataDisplaying.push(<div key="power" className="element-mode-3"><p>{activity.beautyPower}</p></div>)
      if(activity[unitMeasureSelected].beautyAverage && showAverage) dataDisplaying.push(<div key="average" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyAverage}</p></div>)
      // if(activity.beautyCoordinates && showCoordinates) dataDisplaying.push(<div key="coordinates" className="element-mode-3"><p>{activity.beautyCoordinates}</p></div>)
      return (<div id="canvasText" className={classMode3} style={styleText}>{dataDisplaying}</div>)
    } else {
      if(activity[unitMeasureSelected].beautyDistance && showDistance) dataDisplaying.push(<div key="distance" className="element-mode-3-vertical"><p>{activity[unitMeasureSelected].beautyDistance}</p></div>)
      if(activity[unitMeasureSelected].beautyElevation && showElevation) dataDisplaying.push(<div key="elevation" className="element-mode-3-vertical"><p>{activity[unitMeasureSelected].beautyElevation}</p></div>)
      if(activity.beautyDuration && showDuration) dataDisplaying.push(<div key="duration" className="element-mode-3-vertical"><p>{activity.beautyDuration}</p></div>)
      // if(activity.beautyPower && showPower) dataDisplaying.push(<div key="power" className="element-mode-3-vertical"><p>{activity.beautyPower}</p></div>)
      // if(activity[unitMeasureSelected].beautyAverage && showAverage) dataDisplaying.push(<div key="average" className="element-mode-3-vertical"><p>{activity[unitMeasureSelected].beautyAverage}</p></div>)
      return (<div id="canvasText" className={classMode3Vertical} style={styleText}>{dataDisplaying}</div>)
    }
  }

  const returnMode4Disposition = () => {
    // let dataDisplaying = []
    return (<div id="canvasText"></div>)
  }
  
  const returnMode5Disposition = () => {
    let dataDisplaying = []
    
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataDisplaying.push(<div key="distance" className="element-mode-5"><p className="text-mode-5">{vocabulary[language].IMAGE_DISTANCE}</p><p className="data-mode-5">{activity[unitMeasureSelected].beautyDistance}</p></div>)
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataDisplaying.push(<div key="elevation" className="element-mode-5"><p className="text-mode-5">{vocabulary[language].IMAGE_ELEVATION}</p><p className="data-mode-5">{activity[unitMeasureSelected].beautyElevation}</p></div>)
    if(activity.beautyDuration && showDuration) dataDisplaying.push(<div key="duration" className="element-mode-5"><p className="text-mode-5">{vocabulary[language].IMAGE_DURATION}</p><p className="data-mode-5">{activity.beautyDuration}</p></div>)
    return (<div id="canvasText" className={classMode5} style={styleText}><div className={classWrapperMode5}>{dataDisplaying}</div></div>)
  }
  const returnMode6Disposition = () => {
    let dataShowing = []
    if(activity[unitMeasureSelected].beautyDistanceSpaced && showDistance) dataShowing.push(<div key="distance" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_DISTANCE}</p><p>{activity[unitMeasureSelected].beautyDistanceSpaced}</p></div>)
    if(activity[unitMeasureSelected].beautyElevationGain && showElevation) dataShowing.push(<div key="elevation" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_ELEVATION_GAIN}</p><p>{activity[unitMeasureSelected].beautyElevationGain}</p></div>)
    if(activity.beautyMovingTime && showDuration) dataShowing.push(<div key="duration" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_MOVING_TIME}</p><p>{activity.beautyMovingTime}</p></div>)
    if(activity.beautyPowerSpaced && showPower) dataShowing.push(<div key="power" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_AVERAGE_POWER}</p><p>{activity.beautyPowerSpaced}</p></div>)
    if(activity[unitMeasureSelected].beautyAverageSpeed && showAverage) dataShowing.push(<div key="average" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_AVERAGE_SPEED}</p><p>{activity[unitMeasureSelected].beautyAverageSpeed}</p></div>)
    if(activity.beautyCalories && showCalories) dataShowing.push(<div key="calories" className={classesDataElement}><p className={classesDataPLittle}>{vocabulary[language].IMAGE_CALORIES}</p><p>{activity.beautyCalories}</p></div>)
    let lines = []
    if (dataShowing.length > 0) {
      lines.push([...dataShowing.slice(0, 2)]);
      if (dataShowing.length > 2) {
        lines.push([...dataShowing.slice(2, 4)]);
        if (dataShowing.length > 4) {
          lines.push([...dataShowing.slice(4)]);
        }
      }
    }      
    let elementReturning = lines.length > 0 ? (
      <div id="canvasText" style={styleText} className={classesDataWrapper3Lines}>
        {lines.map((line, index) => (
          <div key={index} className={classesDataWrapperLine}>
            {line}
          </div>
        ))}
      </div>
    ) : <div></div>
    console.log('elementReturning:', elementReturning)
    return(<div>{elementReturning}</div>)
  }

  // const bubbleChangeLanguage = (value) => {
  //   handleBubbleLanguage(value)
  // }

  useEffect(() => {
    // if(club && club.name === 'dev-admin') {
    //   setIsLoading(true)
    //   seeHiding()
    // }
    // if(activity.photoUrl) fetchImage()
    handleCrop(ratio, imageSrc)
  }, [
      ratio,
      canvasHeight,
      canvasWidth,
      handleCrop,
      imageSrc,
      club,
      modeSelected
      // activity.photoUrl,
      // fetchImage
    ])

  const openModal = () => {
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  const setMode = (mode) => {
    console.log('mode:', mode)
    // setIsLoading(true)
    setModeSelected(mode)
    handleClickDispatcher({type: 'show-hide', subtype: mode, show: true, start: true})
    // setIsLoading(false)
  }
  
  return (
    <div className="wrapper-main">
      {showModal && <Modal ref={modaldRef} activity={activity} infoLog={infoLog} club={club} admin={admin} language={language} activityId={activityId} userId={userId} visitId={visitId} handleCloseModal={() => closeModal()}/>}
      <div className="header-wrapper width-header-wrapper">
        <div className="back-button" onClick={() => handleBack()}>
          <div className="back-arrow-container">
            <ArrowLeft className="back-image"/>
          </div>
          <div className="back-text-container">
            <p className="p-back">{vocabulary[language].HOMEPAGE_BACK}</p>
          </div>
        </div>
        <div className="language-selector">
          {/* <Dropdown value={language} values={languages} type="language" handleChangeValue={bubbleChangeLanguage}/> */}
        </div>
      </div>
      {/* <div className="back-button" onClick={() => handleBack()}>
        <ArrowLeft className="back-image"/>
        <p className="p-back">{vocabulary[language].HOMEPAGE_BACK}</p>
      </div> */}
      {!modeSelected && <Selector vocabulary={vocabulary} language={language} handleSelectMode={setMode}/>}
      {modeSelected && <div className="width-wrapper-main">
        <div className="beauty-border" id="hidingDiv">
          <div className={classesCanvasContainer} id="printingAnchor" translate="no">
            <canvas id="canvasImage" className="width-general canvas-image canvas-position round-corner" ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
            <canvas id="canvasFilter" className="width-general canvas-filter canvas-position round-corner" style={filterStyle} width={canvasWidth} height={canvasHeight}/>
            {!showMode6 && <canvas id="canvasSketch" className={classesSketch} width={drawingWidth} height={drawingHeight} style={styleText}/>}
            {/* {!showMode6 && showMode4 && <canvas id="canvasSketchMode4" className={classesSketch} width={drawingWidth} height={drawingHeight} style={styleText}/>} */}
            {showTitle && !showMode5 && !showMode6 && (
              <div className="width-general text-overlay text-title">
                <div id="canvasText" style={styleTextTitle} className={classesName}><p>{activity.beautyName}</p></div>
                {showDate && activity && activity.beautyDatetimeLanguages && (<div id="canvasText" style={styleTextTitle} className={classesDate}><p>{activity.beautyDatetimeLanguages[language]}</p></div>)}
              </div>
            )}
            {showTitle && showMode5 && !showMode6 && (
              <div className="width-general text-overlay text-title">
                <div id="canvasText" style={styleTextTitle} className={classesName}><p>{activity.beautyNameNoEmoji}</p></div>
              </div>
            )}
            {club && club.hasImageLogo && club.imageLogo(classesLogoClub, styleLogoClub)}
            {showMode1 && returnMode1Disposition()}
            {showMode2 && returnMode2Disposition()}
            {showMode3 && returnMode3Disposition()}
            {showMode4 && returnMode4Disposition()}
            {showMode5 && returnMode5Disposition()}
            {showMode6 && returnMode6Disposition()}
          </div>
        </div>
        {isLoading && 
          <div className="background-loading" id="loader">
            <div className="translate-loading">
              <Loader/>
            </div>
          </div>
        }
        <div>
          {/* {imageToShare && admin && <img className="beauty-border width-general" id="showingImage" src={imageToShare} alt="img ready to share"/>} */}
        </div>
        <ButtonImage translate="no" className="indexed-height" activity={activity} unitMeasure={unitMeasureSelected} language={language} admin={admin} modeselected={modeSelected} handleClickButton={handleClickDispatcher}/>
      </div>}
    </div>
  );
}

export default ImageComponent
