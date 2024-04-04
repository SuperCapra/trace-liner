import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import ButtonImage from './ButtonImage.js'
import domtoimage from 'dom-to-image';
import logoNamaSVG from './logoNama.png'
import html2canvas from 'html2canvas';

function ImageComponent(props) {
  const [canvasWidth, setCanvasWidth] = useState(null); // Initial width
  const [canvasHeight, setCanvasHeight] = useState(null); // Initial height
  const [xCrop, setXCrop] = useState(null); // Initial width
  const [yCrop, setYCrop] = useState(null); // Initial height
  const [isCropped, setIsCropped] = useState(false);
  const [drawingColor, setDrawingColor] = useState('white');
  const [thickness, setThickness] = useState(null);
  const [ratio, setRatio] = useState('9:16');
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

  const handleDownloadClick = () => {
    html2canvas(document.getElementById('printingAnchor')).then(canvas => {
      const dataURL = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = props.activity.beautyName.replaceAll(' ','_').toLowerCase() + '.jpeg'
      a.click();
    });
  }

  const drawLine = (ctx, coodinates, width, height) => {
    let border = width*0.2
    setThickness(width*0.01)
    let fontSize = String(width*0.04)

    let minX = Math.min(...coodinates.map(x => x[0]))
    let maxX = Math.max(...coodinates.map(x => x[0]))
    let minY = Math.min(...coodinates.map(x => x[1]))
    let maxY = Math.max(...coodinates.map(x => x[1]))
    
    let mapWidth = maxX - minX
    let mapHeight = maxY - minY
    let mapCenterX = (minX + maxX) / 2
    let mapCenterY = (minY + maxY) / 2

    let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)

    ctx.strokeStyle = drawingColor
    ctx.fillStyle = drawingColor
    ctx.lineWidth = thickness

    ctx.beginPath()

    for(let i = 0; i < coodinates.length; i++) {
      let c = coodinates[i]
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
    }

    ctx.stroke()
  }

  const handleClickDispatcher = (data) => {
    console.log('data:', data)
    if(data.type === 'share') handleDownloadClick()
    else if(data.type === 'changing-color') handleColorChange(data.color)
    else if(data.type === 'rectangle' || data.type === 'square') handleCrop(data.type === 'square' ? '1:1' : '9:16')
    else if(data.type === 'show-hide') {
      if(data.subtype === 'name') {
        setShowName(data.show)
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
    if(ratioText === '1:1') {
      let min = Math.min(imageReferenceWidth, imageReferenceHeight)
      setXCrop(imageReferenceWidth === imageReferenceHeight || imageReferenceWidth < imageReferenceHeight ? 0 : (imageReferenceWidth - min) / 2)
      setYCrop(imageReferenceWidth === imageReferenceHeight || imageReferenceWidth > imageReferenceHeight ? 0 : (imageReferenceHeight - min) / 2)
      setCanvasWidth(min)
      setCanvasHeight(min)
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
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        drawLine(ctx, props.activity.coordinates, canvasWidth, canvasHeight)
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
    image.style = {
      opacity: 0
    }

    if (canvas && canvasWidth && canvasHeight) {
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
        ctx.filter = 'greyscale(100%)'
        drawLine(ctx, props.activity.coordinates, canvasWidth, canvasHeight)
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
        <canvas id="canvasImage" className="canvas-image"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}/>
          {showName && (<div className="text-name">{props.activity.beautyName}</div>)}
          {showDate && (<div className="text-date">{props.activity.beautyDate}</div>)}
          {showDistance && (<div className="text-distance">{props.activity.beautyDistance}</div>)}
          {showDuration && (<div className="text-duration">{props.activity.beautyDuration}</div>)}
          {showElevation && (<div className="text-elevation">{props.activity.beautyElevation}</div>)}
          {showAverage && (<div className="text-average">{props.activity.beautyAverage}</div>)}
          {showPower && (<div className="text-power">{props.activity.beautyAverage}</div>)}
          {showCoordinates && (<div className="text-coordinates">{props.activity.beautyCoordinates}</div>)}
      </div>
      <ButtonImage activity={props.activity} handleClickButton={handleClickDispatcher}/>
    </div>
  );
}

export default ImageComponent