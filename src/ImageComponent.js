import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import ButtonImage from './ButtonImage.js'
import logoNamaSVG from './logoNama.png'
import html2canvas from 'html2canvas';

function ImageComponent(props) {
  const [canvasWidth, setCanvasWidth] = useState(null); // Initial width
  const [canvasHeight, setCanvasHeight] = useState(null); // Initial height
  const [xCrop, setXCrop] = useState(null); // Initial width
  const [yCrop, setYCrop] = useState(null); // Initial height
  const [isCropped, setIsCropped] = useState(false);
  const [drawingColor, setDrawingColor] = useState('white');
  const [filterColor, setFilterColor] = useState('white');
  const [thickness, setThickness] = useState(null);
  const [ratio, setRatio] = useState('9:16');
  const [showTitle, setShowTitle] = useState(true);
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const canvasRef = useRef(null)

  const image = new Image()

  const styleText = {
    color: drawingColor
  }
  const classesName = ratio === '1:1' ? 'text-overlay text-title-props text-name-props' : 'text-overlay text-title-props-rect text-name-props'
  const classesDate = ratio === '1:1' ? 'text-overlay text-title-props text-date-props' : 'text-overlay text-title-props-rect text-date-props'
  const classesCoordinates = ratio === '1:1' ? 'text-overlay text-coordinates-props' : 'text-overlay text-coordinates-props text-coordinates-props-rect'
  const classesSketch = ratio === '1:1' ? 'canvas-filter canvas-sketch' : 'canvas-filter canvas-sketch-rect'

  const handleDownloadClick = () => {
    html2canvas(document.getElementById('printingAnchor')).then(canvas => {
      const dataURL = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = props.activity.beautyName.replaceAll(' ','_').toLowerCase() + '.jpeg'
      a.click();
    });
  }

  const drawLine = (coodinates, width, height) => {
    let canvasSketch = document.getElementById('canvasSketch')
    let ctx = canvasSketch.getContext('2d')
    // let border = width*0.2
    setThickness(width*0.01)

    let minX = Math.min(...coodinates.map(x => x[0]))
    let maxX = Math.max(...coodinates.map(x => x[0]))
    let minY = Math.min(...coodinates.map(x => x[1]))
    let maxY = Math.max(...coodinates.map(x => x[1]))
    
    let mapWidth = maxX - minX
    let mapHeight = maxY - minY
    let mapCenterX = (minX + maxX) / 2
    let mapCenterY = (minY + maxY) / 2

    //TODO with this altgorithim the sketch results distorted
    // let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)
    let zoomFactor = Math.min(width / mapWidth, height / mapHeight)
    // let zoomFactor = width / mapWidth

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.strokeStyle = drawingColor
    ctx.fillStyle = drawingColor
    ctx.lineWidth = thickness

    ctx.beginPath()

    for(let i = 0; i < coodinates.length; i++) {
      let c = coodinates[i]
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
      // ctx.lineTo((c[0]-mapCenterY)*zoomFactor + width/2, -(c[0]-mapCenterY)*zoomFactor + width/2)
    }

    ctx.stroke()
  }

  const drawFilter = () => {
    let canvasFilter = document.getElementById('canvasFilter')
    let ctx = canvasFilter.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = filterColor
    ctx.filter = 'opacity(50%)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const handleClickDispatcher = (data) => {
    console.log('data:', data)
    if(data.type === 'share') handleDownloadClick()
    else if(data.type === 'changing-color') handleColorChange(data.color)
    else if(data.type === 'rectangle' || data.type === 'square') handleCrop(data.type === 'square' ? '1:1' : '9:16')
    else if(data.type === 'show-hide') {
      if(data.subtype === 'name') {
        setShowTitle(data.show)
      } else if(data.subtype === 'date') {
        setShowDate(data.show)
      } else if(data.subtype === 'distance') {
        setShowDistance(data.show)
      } else if(data.subtype === 'duration') {
        setShowDuration(data.show)
      } else if(data.subtype === 'elevation') {
        setShowElevation(data.show)
      } else if(data.subtype === 'average') {
        setShowAverage(data.show)
      } else if(data.subtype === 'power') {
        setShowPower(data.show)
      } else if(data.subtype === 'coordinates') {
        setShowCoordinates(data.show)
      }
    }
  }

  const handleColorChange = (color) => {
    console.log('color to set', color)
    setDrawingColor(color)
  }

  const handleCrop = (ratioText) => {
    const imageReference = new Image()
    imageReference.src = image.src
    let imageReferenceWidth = imageReference.width
    let imageReferenceHeight = imageReference.height
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if(ratioText === '1:1') {
      let min = Math.min(imageReferenceWidth, imageReferenceHeight)
      setXCrop(imageReferenceWidth === imageReferenceHeight || imageReferenceWidth < imageReferenceHeight ? 0 : (imageReferenceWidth - min) / 2)
      setYCrop(imageReferenceWidth === imageReferenceHeight || imageReferenceWidth > imageReferenceHeight ? 0 : (imageReferenceHeight - min) / 2)
      setCanvasWidth(min)
      setCanvasHeight(min)
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        let minLength = Math.min(canvasWidth, canvasHeight)
        drawLine(props.activity.coordinates, minLength, minLength)
        drawFilter()
      }
    } else {
      let ratioSplitted = ratioText.split(':')
      let ratioCalculated = ratioSplitted[0]/ratioSplitted[1]
      let min = Math.min(imageReferenceWidth, imageReferenceHeight * ratioCalculated)
      let widthRationalized = (imageReferenceWidth === min) ? imageReferenceWidth : imageReferenceHeight * ratioCalculated
      let heightRationalized = (imageReferenceHeight * ratioCalculated === min) ? imageReferenceHeight : imageReferenceWidth / ratioCalculated
      setXCrop(widthRationalized === imageReferenceHeight * ratioCalculated || imageReferenceWidth < imageReferenceHeight * ratioCalculated ? 0 : (imageReferenceWidth - widthRationalized) / 2)
      setYCrop(widthRationalized === imageReferenceHeight * ratioCalculated || imageReferenceWidth > imageReferenceHeight * ratioCalculated ? 0 : (imageReferenceHeight - heightRationalized) / 2)
      setCanvasWidth(widthRationalized)
      setCanvasHeight(heightRationalized)
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        let minLength = Math.min(canvasWidth, canvasHeight)
        drawLine(props.activity.coordinates, minLength, minLength)
        drawFilter()
      }
    }
    setRatio(ratioText)
    setIsCropped(true);
  }


  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // image.src = props.activity.photoUrl
    image.src = props.image

    if (canvas && canvasWidth && canvasHeight) {
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        let minLength = Math.min(canvasWidth, canvasHeight)
        drawLine(props.activity.coordinates, minLength, minLength)
        drawFilter()
      }
    } else if(!canvasWidth && !canvasHeight) {
      handleCrop(ratio)
    }
  }, [
      drawLine, 
      image, 
      xCrop, 
      yCrop, 
      canvasWidth, 
      canvasHeight, 
      props.activity.coordinates, 
      drawingColor, 
      thickness, 
      ratio,
      showName,
      showDate,
      showDistance,
      showDuration,
      showPower,
      showElevation,
      showAverage,
      showCoordinates
    ])
  
  return (
    <div className="width-80">
      <div className="canvas-container" id="printingAnchor">
          <canvas id="canvasImage" className="canvas-image" ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
          <canvas id="canvasFilter" className="canvas-filter" width={canvasWidth} height={canvasHeight}/>
          <canvas id="canvasSketch" className={classesSketch} width={canvasWidth} height={canvasHeight}/>
          {showTitle && (
            <div className="text-overlay text-title">
              <div id="canvasText" style={styleText} className={classesName}>{props.activity.beautyName}</div>
              <div id="canvasText" style={styleText} className={classesDate}>{props.activity.beautyDate}</div>
            </div>
          )}
          {/* {showName && (<div id="canvasText" style={styleText} className="text-overlay text-name">{props.activity.beautyName}</div>)}
          {showDate && (<div className="text-overlay text-date">{props.activity.beautyDate}</div>)}
          {showDistance && (<div className="text-overlay text-distance">{props.activity.beautyDistance}</div>)}
          {showDuration && (<div className="text-overlay text-duration">{props.activity.beautyDuration}</div>)}
          {showElevation && (<div className="text-overlay text-elevation">{props.activity.beautyElevation}</div>)}
          {showAverage && (<div className="text-overlay text-average">{props.activity.beautyAverage}</div>)}
          {showPower && (<div className="text-overlay text-power">{props.activity.beautyAverage}</div>)} */}
          {showCoordinates && (<div id="canvasText" style={styleText} className={classesCoordinates}>{props.activity.beautyCoordinates}</div>)}
      </div>
      <ButtonImage activity={props.activity} handleClickButton={handleClickDispatcher}/>
    </div>
  );
}

export default ImageComponent