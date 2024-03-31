import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import ButtonImage from './ButtonImage.js'
import domtoimage from 'dom-to-image';

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
    const canvas = document.getElementById('canvasImage')
    const textOverlayCanvas = document.getElementById('textOverlayCanvas');
    mergeTextToCanvas(canvas, textOverlayCanvas)
    // if(mergedCanvas) {
    //   console.log('mergedCanvas', mergedCanvas)
    //   const dataURL = mergedCanvas.toDataURL('image/jpeg') // Convert canvas content to data URL
    //   const a = document.createElement('a')
    //   a.href = dataURL
    //   a.download = props.activity.beautyName.replaceAll(' ','_').toLowerCase() + '.png' // Set the filename for the downloaded image
    //   document.body.appendChild(a)
    //   a.click()
    //   document.body.removeChild(a)
    // }
  }

  const mergeTextToCanvas = (canvas, textOverlay) => {
    const mergedCanvas = document.createElement('canvas');
    const mergedCtx = mergedCanvas.getContext('2d');
  
    // Set the dimensions of the merged canvas to match the original canvas
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;
  
    // Draw the original canvas content onto the merged canvas
    mergedCtx.drawImage(canvas, 0, 0);
  
    // Convert the text overlay to a data URL
    console.log('eccolo')
    domtoimage.toPng(textOverlay).then(dataUrl => {
      console.log(dataUrl)
      // Create an image element for the text overlay
      const textImage = new Image();
      textImage.onload = function() {
        // Draw the text overlay onto the merged canvas
        mergedCtx.drawImage(textImage, 0, 0);
        saveMerged(mergedCanvas)
      };
      textImage.src = dataUrl;
    })

  
  }

  const saveMerged = (mergedCanvas) => {
    console.log('mergedCanvas', mergedCanvas)
    const dataURL = mergedCanvas.toDataURL('image/jpeg') // Convert canvas content to data URL
    const a = document.createElement('a')
    a.href = dataURL
    a.download = props.activity.beautyName.replaceAll(' ','_').toLowerCase() + '.png' // Set the filename for the downloaded image
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Save the merged canvas as an image
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

    ctx.font = fontSize + 'px SourceCodePro';
    ctx.fillStyle = drawingColor;

    if(showName) {
      const xName = height*0.03;
      const yName = height*0.05;
  
      ctx.fillText(props.activity.beautyName, xName, yName);
    }
    if(showDate) {
      const xDate = height*0.03;
      const yDate = height*0.5;
  
      ctx.fillText(props.activity.beautyDate, xDate, yDate);
    }
    if(showDistance) {
      const xDistance = height*0.03;
      const yDistance = height*0.05;
  
      ctx.fillText(props.activity.beautyDistance, xDistance, yDistance);
    }
    if(showDuration) {
      const xDuration = height*0.03;
      const yDuration = height*0.05;
  
      ctx.fillText(props.activity.beautyDuration, xDuration, yDuration);
    }
    if(showElevation) {
      const xElevation = height*0.03;
      const yElevation = height*0.05;
  
      ctx.fillText(props.activity.beautyElevation, xElevation, yElevation);
    }
    if(showPower) {
      const xPower = height*0.03;
      const yPower = height*0.05;
  
      ctx.fillText(props.activity.beautyPower, xPower, yPower);
    }
    if(showCoordinates) {
      const xCoordinates = height*0.03;
      const yCoordinates = height*0.05;
  
      ctx.fillText(props.activity.beautyCoordinates, xCoordinates, yCoordinates);
    }

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
      //TODO handle al the showing-hiding...
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

    if(image.src) console.log('is there the image!')

    if (canvas && canvasWidth && canvasHeight) {
      console.log('image:', image)
      console.log('image:', image.src)
      image.onload = () => {
        ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
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
    <div>
      <div className="canvas-container">
        <canvas id="canvasImage" className="canvas-image"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}/>
          <div id="textOverlayCanvas" className="text-overlay">Overlay Text</div>
      </div>
      <ButtonImage activity={props.activity} handleClickButton={handleClickDispatcher}/>
    </div>
  );
}

export default ImageComponent