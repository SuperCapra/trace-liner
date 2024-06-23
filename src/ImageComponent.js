import './App.css';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import ButtonImage from './ButtonImage.js'
import image1 from './image1.jpeg'
import utils from './utils.js'
import {ReactComponent as ArrowDown} from './arrowDownSimplified.svg'
// import CachedImage from './CachedImage.js'
import {ReactComponent as LogoNamaSVG} from './logoNama.svg'
// import LogoNama from './LogoNama.js'
import html2canvas from 'html2canvas';
import brandingPalette from './brandingPalette.js';
// import { toJpeg } from 'html-to-image';
// import brandingPalette from './brandingPalette.js';
// let firstTime = true

function ImageComponent(props) {

  const {activity, clubname, handleBack} = props

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
  // const [showData, setShowData] = useState(false);
  // const [showDataUnique, setShowDataUnique] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [unitMeasureSelected, setUnitMeasureSelected] = useState('metric');
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [imageSrc, setImageSrc] = useState(image1);
  const canvasRef = useRef(null)
  const [valueFilter, setValueFilter] = useState(0);
  const [showMode1, setShowMode1] = useState(true);
  const [showMode2, setShowMode2] = useState(false);
  const [showMode3, setShowMode3] = useState(false);
  // const [blendMode, setBlendMode] = useState('unset');

  const styleText = {
    color: drawingColor,
    // mixBlendMode: blendMode,
  }
  const filterStyle = {
    opacity: valueFilter/100
  }
  const styleLogoNama = {
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
  const classesForSketch = () => {
    if(showMode3) {
      if(ratio === '1:1') return ('canvas-position canvas-filter canvas-sketch-mode3')
      else return ('canvas-position canvas-filter canvas-sketch-mode3-rect')
    } else {
      if(ratio === '1:1') return ('canvas-position canvas-filter canvas-sketch')
      else return ('canvas-position canvas-filter canvas-sketch-rect')
    }
  }
  const classesCanvasContainer = ratio === '1:1' ? 'width-general canvas-container-general canvas-container-square round-corner' : 'canvas-container-general canvas-container-rect round-corner'
  const classesName = ratio === '1:1' ? 'text-overlay text-title-props text-name-props' : 'text-overlay text-title-props-rect text-name-props'
  const classesDate = ratio === '1:1' ? 'text-overlay text-title-props text-date-props' : 'text-overlay text-title-props-rect text-date-props'
  const classesModeStandard = ratio === '1:1' ? 'text-overlay text-coordinates-props' : 'text-overlay text-coordinates-props text-coordinates-props-rect'
  const classesSketch = classesForSketch()
  const classesDataWrapper2Lines = ratio === '1:1' ? 'width-general wrapper-data-2-lines' : 'width-general wrapper-data-2-lines-rect'
  const classesDataWrapperLine = 'width-general wrapper-data-line'
  const classesDataElement = ratio === '1:1' ? 'wrapper-data-element' : 'wrapper-data-element-rect'
  const classesDataPLittle = 'data-p-little'
  const classesLogoNama = ratio === '1:1' ? 'width-general logo-nama-wrapper' : 'width-general logo-nama-wrapper-rect'
  const styleMode3 = ratio === '1:1' ? 'position-mode-3 text-overlay-mode-3 mode-3-text' : 'position-mode-3-rect text-overlay-mode-3 mode-3-text-rect'
  const styleArrow = {
    fill: brandingPalette.pink,
    transform: 'rotate(90deg)'
  }

  // const fetchAndSetImage = async (url) => {
  //   console.log('fetching image', url)
  //   try {
  //     fetch(url, { 
  //       method: 'GET',
  //       mode: 'no-cors',
  //       headers : {
  //         'Content-Type': 'image/jpeg', 
  //         'Accept': '*/*',
  //         'Accept-Encoding': 'gzip, deflate, br',
  //         'Connection': 'keep-alive'
  //       }
  //     })
  //       .then(res => {
  //         console.log('res', res)
  //         res.blob()
  //       })
  //       .then(resParsed => {
  //         console.log('resParsed', resParsed)
  //       })
  //     // const response = await fetch(url, { 
  //     //   method: 'GET',
  //     //   mode: 'no-cors',
  //     //   headers : {
  //     //     'Content-Type': 'image/jpeg', 
  //     //     'Accept': '*/*',
  //     //     'Accept-Encoding': 'gzip, deflate, br',
  //     //     'Connection': 'keep-alive'
  //     //   }
  //     // }); // Consider handling CORS appropriately
  //     // console.log('response', response)
  //     // const blob = await response.blob();
  //     // const reader = new FileReader();
  //     // reader.onloadend = () => {
  //     //   console.log('fetching onloadend', reader.result)
  //     //   console.log('blob', blob)
  //     //   const base64data = reader.result;
  //     //   setImageSrc(base64data); // This will trigger a re-render
  //     //   const img = new Image();
  //     //   console.log('base64data', base64data)
  //     //   img.onload = () => {
  //     //     // Ensure this image is drawn on the canvas here or make sure canvas operations happen after this point
  //     //     console.log('Image is loaded and ready to be used');
  //     //   };
  //     //   img.src = base64data;
  //     // };
  //     // reader.readAsDataURL(blob);
  //   } catch (e) {
  //     console.error('Error loading image: ', e);
  //   }
  // };

  const handleDownloadClick = async () => {
    document.getElementById('canvasImage').classList.remove('round-corner')
    document.getElementById('canvasFilter').classList.remove('round-corner')
    document.getElementById('printingAnchor').classList.remove('round-corner')
    // let anchor = document.getElementById('printingAnchor')

    // toJpeg(anchor, { quality: 0.95, width: anchor.offsetWidth, height: anchor.offsetHeight })
    //   .then((dataUrl) => {
    //     // const img = new Image();
    //     // img.src = dataUrl;
    //     // document.body.appendChild(img);

    //     // Create a link element to trigger the download
    //     const link = document.createElement('a');
    //     link.download = utils.removeEmoji(activity.beautyName.replaceAll(' ', '_')).toLowerCase();
    //     link.href = dataUrl;
    //     link.click();
    //   })
    //   .catch((error) => {
    //     console.error('oops, something went wrong!', error);
    //   })
    html2canvas(document.getElementById('printingAnchor'), {
      useCORS: true
      // onclone: function(doc) {
      //   console.log('cloning...', doc.getElementById('canvasFilter').classList)
      //   doc.getElementById('canvasImage').classList.remove('round-corner')
      //   doc.getElementById('canvasFilter').classList.remove('round-corner')
      //   console.log('cloning...', doc.getElementById('canvasFilter').classList)
      //   console.log('document', document)
      // }
    }).then(async function(canvas) {
      console.log('canvas: ', canvas)
      canvas.toBlob(async function(blob) {
        // console.log('try to share..., navigator.share', navigator.share)
        // console.log('try to share..., navigator.canShare', navigator.canShare)
        console.log('navigator.share', navigator.share)
        if(navigator.share) {
            try {
                const file = new File([blob], 'image.jpeg', {type: 'image/jpeg', lastModified: new Date()});
                await navigator.share({
                    title: utils.removeEmoji(activity.beautyName.replaceAll(' ', '_')).toLowerCase(),
                    files: [file],
                });
            } catch (error) {
                console.error('Error sharing image:', error);
            }
        } else {
            const url = URL.createObjectURL(blob);
            const temp = document.createElement('a');
            temp.href = url;
            temp.download = activity.beautyName.replaceAll(' ', '_').toLowerCase() + '.jpeg';
            temp.click();
            URL.revokeObjectURL(url); // Clean up URL object after use
        }
    }, 'image/jpeg');
    })
    .finally(() => {
      document.getElementById('canvasImage').classList.add('round-corner')
      document.getElementById('canvasFilter').classList.add('round-corner')
      document.getElementById('printingAnchor').classList.add('round-corner')
    })
  }

  const drawLine = useCallback((color, canvasWidth, canvasHeight) => {
    let canvasSketch = document.getElementById('canvasSketch')
    console.log('drawLine:', canvasSketch)
    let canvasSketchWidth = (canvasWidth ? canvasWidth : canvasSketch.getBoundingClientRect().width) * 5
    let canvasSketchHeight = (canvasHeight ? canvasHeight : canvasSketch.getBoundingClientRect().height) * 5
    let coordinates = activity.coordinates
    console.log('coordinates:', coordinates)
    let width = Math.min(canvasSketchHeight, canvasSketchWidth)
    let height = Math.min(canvasSketchHeight, canvasSketchWidth)
    setDrawingHeight(width)
    setDrawingWidth(height)
    let ctx = canvasSketch.getContext('2d')
    // Setup line properties to avoid spikes
    ctx.lineJoin = 'round'; // Options: 'bevel', 'round', 'miter'
    ctx.lineCap = 'round';  // Options: 'butt', 'round', 'square'
    console.log('width: ', width)
    console.log('height: ', height)
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

    // let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)
    let zoomFactor = Math.min(width / mapWidth, height / mapHeight) * 0.95
    console.log('zoomFactor:', zoomFactor)
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = color 
    ctx.lineWidth = width * 0.01
    let lengthCoordinates = coordinates.length
    let drawing = true
    // ctx.setLineDash([Number((lengthCoordinates * 0.003).toFixed(0)), Number((lengthCoordinates * 0.008).toFixed(0))]);
    ctx.beginPath()
    let dimentionCircle = width * 0.02
  
    let rightHeight = height/2
    let rightZoomY = zoomFactor
    let endCoordinates = [(coordinates[lengthCoordinates - 1][0] - mapCenterX)*zoomFactor + width/2, -(coordinates[lengthCoordinates - 1][1] - mapCenterY)*zoomFactor + rightHeight]
    // let coordinatesDrawing = []
    // coordinatesDrawing = coordinates.map((x) => ([(x[0]-mapCenterX)*zoomFactor + width/2,-(x[1]-mapCenterY)*rightZoomY + rightHeight]))
    for(let i = 0; i < coordinates.length; i++) {
      let c = coordinates[i]
      let cd = [(c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*rightZoomY + rightHeight]
      if(drawing) {

      }
      if(utils.quadraticFunction(cd,endCoordinates) > (dimentionCircle * dimentionCircle)) {
        if(!drawing) {
          drawing = true
          ctx.beginPath()
        }
        ctx.lineTo(cd[0],cd[1])
      } else {
        if(drawing) ctx.stroke()
        drawing = false
      }
      // ctx.lineTo(cd[0],cd[1])
    }
    // ctx.strokeStyle = pattern
    // ctx.fill()
    
    ctx.stroke()
    ctx.beginPath()
    ctx.arc((coordinates[lengthCoordinates - 1][0] - mapCenterX)*zoomFactor + width/2, -(coordinates[lengthCoordinates - 1][1] - mapCenterY)*zoomFactor + rightHeight, dimentionCircle, 0, Math.PI * 2);
    ctx.stroke()
    // const finishPatternPNGRef = new Image()
    // finishPatternPNGRef.src = finishPatternPNG
    // console.log('finishPatternPNGRef.width', finishPatternPNGRef.width)
    // ctx.drawImage(finishPatternPNGRef, (coordinates[lengthCoordinates - 1][0] - mapCenterX)*zoomFactor + width/2 - 40, -(coordinates[lengthCoordinates - 1][1] - mapCenterY)*zoomFactor + rightHeight - 40)

  },[
    activity.coordinates,
    // setRatio
    // ratio, 
    // canvasWidth, 
    // canvasHeight
  ])

  const drawFilter = useCallback((width, height) => {
    let widthToUse = width ? width : canvasWidth
    let heightToUse = height ? height : canvasHeight
    let canvasFilter = document.getElementById('canvasFilter')
    let ctx = canvasFilter.getContext('2d')
    ctx.clearRect(0, 0, widthToUse, heightToUse)
    ctx.fillStyle = filterColor
    // ctx.filter = 'opacity(' + valueFilter + '%)'
    ctx.fillRect(0, 0, widthToUse, heightToUse);
  }, [
    // valueFilter,
    filterColor, 
    canvasWidth, 
    canvasHeight
  ])

  const handleClickDispatcher = (data) => {
    console.log('data:', data)
    if(data.type === 'filterSlider') {
      setValueFilter(data.value)
      drawFilter()
    }
    else if(data.type === 'share') handleDownloadClick()
    // else if(data.type === 'blend-mode') handleBlendMode(data.blendMode)
    else if(data.type === 'changing-color') handleColorChange(data.color)
    else if(data.type === 'rectangle' || data.type === 'square') {
      setRatio(data.type === 'square' ? '1:1' : '9:16')
      handleCrop(data.type === 'square' ? '1:1' : '9:16', imageSrc)
    }
    else if(data.type === 'show-hide') {
      if(data.subtype === 'name') {
        setShowTitle(data.show)
        if(data.show) {
          setShowDate(true)
        } else {
          setShowDate(false)
        }
      } else if(data.subtype === 'date') {
        setShowDate(data.show)
      } else if(data.subtype === 'distance') {
        setShowDistance(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'duration') {
        setShowDuration(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'elevation') {
        setShowElevation(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'average') {
        setShowAverage(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'power') {
        setShowPower(data.show)
        if(data.show) setShowCoordinates(false)
      } else if(data.subtype === 'coordinates') {
        setShowCoordinates(data.show)
        if(data.show) {
          enableMode1(false, false)
        }
      } else if(data.subtype === 'mode1') {
        setShowMode1(data.show)
        if(data.show) {
          setShowMode2(!data.show)
          setShowMode3(!data.show)
          enableMode1(data.show, true)
        }
        if(data.show) enableMode1(true)
      } else if(data.subtype === 'mode2') {
        setShowMode2(data.show)
        if(data.show) {
          setShowMode1(!data.show)
          setShowMode3(!data.show)
          enableMode2()
        }
      }  else if(data.subtype === 'mode3') {
        setShowMode3(data.show)
        if(data.show) {
          setShowMode1(!data.show)
          setShowMode2(!data.show)
          enableMode3()
        }
      }
    } else if(data.type === 'image') {
      console.log('data', data)
      setImage(data.image)
    } else if(data.type === 'unit') {
      setUnitMeasureSelected(data.unit)
    }
  }

  const enableMode1 = (bool, isStart) => {
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

  const enableMode2 = () => {
    setShowTitle(true)
    setShowDate(true)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
  }

  const enableMode3 = () => {
    setShowTitle(false)
    setShowDate(false)
    setShowDistance(true)
    setShowElevation(true)
    setShowDuration(true)
    setShowPower(true)
    setShowAverage(true)
    setShowCoordinates(true)
  }

  const handleColorChange = (color) => {
    console.log('color to set:', color)
    setDrawingColor(color)
    drawLine(drawingColor, canvasWidth, canvasHeight)
    drawFilter()
  }

  // const handleBlendMode = (blendModeSetting) => {
  //   console.log('Blend mode to set:', blendModeSetting)
  //   if(drawingColor === '#000000' || (showMode3 && drawingColor === '#282c34')) {
  //     handleColorChange(brandingPalette.pink)
  //   } else {
  //     drawLine(drawingColor)
  //     drawFilter()
  //   }
  //   setBlendMode(blendModeSetting)
  // }

  const handleCrop = useCallback((ratioText, imgSrc) => {
    console.log('ratioText:', ratioText)
    if(!imgSrc) imgSrc = image1
    const imageReference = new Image()
    imageReference.onload = () => {
      let imageReferenceWidth = imageReference.width
      let imageReferenceHeight = imageReference.height

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      console.log('imageReference', imgSrc)

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
      
      console.log('canvasWidth1', canvasWidth)
      console.log('canvasHeight1', canvasHeight)
      let scaleFactorWidth = 1
      let scaleFactorHeight = 1
      // Scale the canvas and cropping dimensions by half
      if(canvasWidth > 2000 || canvasHeight > 2000) {
        if(canvasWidth > canvasHeight) {
          scaleFactorWidth = canvasWidth / 2000
          scaleFactorHeight = scaleFactorWidth
        } else {
          scaleFactorHeight = canvasHeight / 2000
          scaleFactorWidth = scaleFactorHeight
        }
      }

      canvasWidth *= 1 / scaleFactorWidth;
      canvasHeight *= 1 / scaleFactorHeight;
      xCropTemp *= 1 / scaleFactorWidth;
      yCropTemp *= 1 / scaleFactorHeight;

      console.log('canvasWidth2', canvasWidth)
      console.log('canvasHeight2', canvasHeight)
      setXCrop(xCropTemp);
      setYCrop(yCropTemp);
      setCanvasWidth(canvasWidth);
      setCanvasHeight(canvasHeight);

      // Clear the canvas and draw the image scaled down
      console.log('canvas.width', canvas.width)
      console.log('canvas.height', canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageReference, xCrop, yCrop, canvasWidth * scaleFactorHeight, canvasHeight * scaleFactorWidth, 0, 0, canvasWidth, canvasHeight);
      drawFilter(canvasWidth, canvasHeight);
      drawLine(drawingColor, canvasWidth, canvasHeight);
  };

    // Important: Set src after defining onload to ensure it is loaded before drawing
    imageReference.src = imgSrc;
  }, [
    drawFilter,
    drawingColor,
    drawLine,
    xCrop,
    yCrop
  ])

  const setImage = (newImage) => {
    setImageSrc(newImage)
    handleCrop(ratio, newImage)
  }

  const returnMode1Disposition = () => {
    let line1 = []
    let line2 = []
    let dataShowing = []
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataShowing.push(<div key="distance" className={classesDataElement}><p className={classesDataPLittle}>Distance</p><p>{activity[unitMeasureSelected].beautyDistance}</p></div>)
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataShowing.push(<div key="elevation" className={classesDataElement}><p className={classesDataPLittle}>Elevation</p><p>{activity[unitMeasureSelected].beautyElevation}</p></div>)
    if(activity.beautyDuration && showDuration) dataShowing.push(<div key="duration" className={classesDataElement}><p className={classesDataPLittle}>Duration</p><p>{activity.beautyDuration}</p></div>)
    if(activity.beautyPower && showPower) dataShowing.push(<div key="power" className={classesDataElement}><p className={classesDataPLittle}>Power</p><p>{activity.beautyPower}</p></div>)
    if(activity[unitMeasureSelected].beautyAverage && showAverage) dataShowing.push(<div key="average" className={classesDataElement}><p className={classesDataPLittle}>Average</p><p>{activity[unitMeasureSelected].beautyAverage}</p></div>)
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
    let dataToDisplay = ''
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataToDisplay += activity[unitMeasureSelected].beautyDistance
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataToDisplay += (dataToDisplay.length ? ' x ' : '') + activity[unitMeasureSelected].beautyElevation
    if(activity.beautyDuration && showDuration) dataToDisplay += (dataToDisplay.length ? ' x ' : '') + activity.beautyDuration
    return(<div id="canvasText" style={styleTextUnderSketch} className={classesModeStandard}>{dataToDisplay}</div>)
  }

  const returnMode3Disposition = () => {
    let dataToDisplay = []
    if(activity[unitMeasureSelected].beautyDistance && showDistance) dataToDisplay.push(<div key="distance" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyDistance}</p></div>)
    if(activity[unitMeasureSelected].beautyElevation && showElevation) dataToDisplay.push(<div key="elevation" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyElevation}</p></div>)
    if(activity.beautyDuration && showDuration) dataToDisplay.push(<div key="duration" className="element-mode-3"><p>{activity.beautyDuration}</p></div>)
    if(activity.beautyPower && showPower) dataToDisplay.push(<div key="power" className="element-mode-3"><p>{activity.beautyPower}</p></div>)
    if(activity[unitMeasureSelected].beautyAverage && showAverage) dataToDisplay.push(<div key="average" className="element-mode-3"><p>{activity[unitMeasureSelected].beautyAverage}</p></div>)
    // if(activity.beautyCoordinates && showCoordinates) dataToDisplay.push(<div key="coordinates" className="element-mode-3"><p>{activity.beautyCoordinates}</p></div>)
    return (<div id="canvasText" className={styleMode3} style={styleText}>{dataToDisplay}</div>)
  }

  useEffect(() => {
    // drawLine(drawingColor)
    handleCrop(ratio, imageSrc)
    // if (activity.photoUrl && !imageSrc) {
    //   fetchAndSetImage(activity.photoUrl);
    // } else if(!activity.photoUrl || (activity.photoUrl && imageSrc)) {
    // }
  }, [
      ratio,
      canvasHeight,
      canvasWidth,
      handleCrop,
      imageSrc
    ])
  
  return (
    <div className="wrapper-main">
      <div className="back-button" onClick={() => handleBack()}>
        <ArrowDown className="back-image"/>
        <p className="p-back">BACK</p>
      </div>
      <div className="width-wrapper-main">
        <div className="beauty-border">
          <div className={classesCanvasContainer} id="printingAnchor">
              <canvas id="canvasImage" className="width-general canvas-image canvas-position round-corner" ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
              <canvas id="canvasFilter" className="width-general canvas-filter canvas-position round-corner" style={filterStyle} width={canvasWidth} height={canvasHeight}/>
              <canvas id="canvasSketch" className={classesSketch} width={drawingWidth} height={drawingHeight} style={styleText}/>
              {showTitle && (
                <div className="width-general text-overlay text-title">
                  <div id="canvasText" style={styleText} className={classesName}>{activity.beautyName}</div>
                  {showDate && (<div id="canvasText" style={styleText} className={classesDate}>{activity.beautyDate}</div>)}
                </div>
              )}
              {clubname === 'nama-crew' &&
                <div className={classesLogoNama}>
                  {/* <LogoNama className="logo-nama-svg" style={styleLogoNama} blending-style={styleText}/> */}
                  <LogoNamaSVG className="logo-nama-svg" style={styleLogoNama}/>
                </div>
              }
              {showMode1 && returnMode1Disposition()}
              {showMode2 && returnMode2Disposition()}
              {showMode3 && returnMode3Disposition()}
          </div>
        </div>
        <ButtonImage className="indexed-height" activity={activity} unitMeasure={unitMeasureSelected} handleClickButton={handleClickDispatcher}/>
      </div>
    </div>
  );
}

export default ImageComponent
