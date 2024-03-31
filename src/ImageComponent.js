import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import ButtonImage from './ButtonImage.js'

function ImageComponent(props) {
  const [canvasWidth, setCanvasWidth] = useState(null); // Initial width
  const [canvasHeight, setCanvasHeight] = useState(null); // Initial height
  const [imageWidth, setImageWidth] = useState(null); // Initial width
  const [imageHeight, setImageHeight] = useState(null); // Initial height
  const [isCropped, setIsCropped] = useState(false);
  const [drawingColor, setDrawingColor] = useState('white');
  const canvasRef = useRef(null)

  const image = new Image()

  const handleDownloadClick = () => {
    const canvas = canvasRef
    if(canvas) {
      const dataURL = canvas.toDataURL('image/jpeg') // Convert canvas content to data URL
      const a = document.createElement('a')
      props.activity.name = 'ciccio pasticcio'
      a.href = dataURL
      a.download = props.activity.name.replaceAll(' ','_').toLowerCase() + '.png' // Set the filename for the downloaded image
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const drawLine = (ctx, coodinates, width, height) => {
    let border = width*0.2

    let minX = Math.min(...coodinates.map(x => x[0]))
    let maxX = Math.max(...coodinates.map(x => x[0]))
    let minY = Math.min(...coodinates.map(x => x[1]))
    let maxY = Math.max(...coodinates.map(x => x[1]))

    // console.log('minX:', minX)
    // console.log('maxX:', maxX)
    // console.log('minY:', minY)
    // console.log('maxY:', maxY)
    
    let mapWidth = maxX - minX
    let mapHeight = maxY - minY
    let mapCenterX = (minX + maxX) / 2
    let mapCenterY = (minY + maxY) / 2

    // console.log('mapWidth:', mapWidth)
    // console.log('mapHeight:', mapHeight)

    let zoomFactor = Math.min((width - border) / mapWidth, (height - border) / mapHeight)

    // console.log('mapWidth*zoomFactor:', mapWidth*zoomFactor)
    // console.log('mapHeight*zoomFactor:', mapHeight*zoomFactor)

    // set line stroke and line width
    ctx.strokeStyle = drawingColor
    ctx.fillStyle = drawingColor
    ctx.lineWidth = 100

    ctx.beginPath()

    for(let i = 0; i < coodinates.length; i++) {
      let c = coodinates[i]
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
    }

    ctx.stroke()
  }

  const handleClickDispatcher = (data) => {
    console.log('here we are!', data)
    if(data.type === 'share') handleDownloadClick()
    if(data.type === 'changing-color') handleColorChange(data.color)
    if(data.type === 'rectangle' || data.type === 'square') handleCrop(data.type === 'square' ? '1:1' : '9:16')
  }

  const handleColorChange = (color) => {
    console.log('color to set', color)
    setDrawingColor(color)
  }

  const handleCrop = (ratioText) => {
    const imageReference = new Image()
    imageReference.src = props.image
    let imageReferenceWidth = imageReference.width
    let imageReferenceHeight = imageReference.height
    if(ratioText === '1:1') {
      let min = Math.min(imageReferenceWidth, imageReferenceHeight)
      setCanvasWidth(min)
      setCanvasHeight(min)
    } else {
      let ratioSplitted = ratioText.split(':')
      let ratio = ratioSplitted[0]/ratioSplitted[1]
      console.log('handle rectangle!')
      setCanvasWidth(2000)
      setCanvasHeight(image.height)
    }
    setIsCropped(true);
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    image.src = props.image

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (canvas) {
      console.log('image:', image)
      console.log('image:', image.src)
      image.onload = () => {
        ctx.drawImage(image, 350, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.width)
        drawLine(ctx, props.activity.coordinates, canvas.width, canvas.height)
      }
    }

  }, [drawLine, image, canvasWidth, canvasHeight, props.activity.coordinates, drawingColor])
  
  return (
    <div>
      <canvas className="canvas-image"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      />
      <ButtonImage onClickButton={handleClickDispatcher}/>
    </div>
  );
}

export default ImageComponent