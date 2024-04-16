import './App.css';
import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import ButtonImage from './ButtonImage.js'
import CachedImage from './CachedImage.js'
import {ReactComponent as LogoNameSVG} from './logoNama.svg'
import html2canvas from 'html2canvas';
import image1 from './image1.jpeg'
// import Share from 'react-native-share';

function ImageComponent(props) {
  const [canvasWidth, setCanvasWidth] = useState(null); // Initial width
  const [canvasHeight, setCanvasHeight] = useState(null); // Initial height
  const [xCrop, setXCrop] = useState(null); // Initial width
  const [yCrop, setYCrop] = useState(null); // Initial height
  const [isCropped, setIsCropped] = useState(false);
  const [drawingColor, setDrawingColor] = useState('white');
  const [filterColor, setFilterColor] = useState('white');
  const [ratio, setRatio] = useState('9:16');
  const [showTitle, setShowTitle] = useState(true);
  const [showName, setShowName] = useState(true);
  const [showData, setShowData] = useState(false);
  const [showDataUnique, setShowDataUnique] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [showElevation, setShowElevation] = useState(true);
  const [showAverage, setShowAverage] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [valueFilter, setValueFilter] = useState(0);
  const action = useRef('setInitialImage')

  const calculateMemoImage = useCallback((action) => {
    let result = new Image()
    if(action.current === 'setInitialImage') {
      // setImageSrc((props.activity.photoUrl) ? props.activity.photoUrl : image1)
      // result.src = (props.activity.photoUrl) ? props.activity.photoUrl : image1
      setImageSrc(image1)
      result.src = image1
      action.current = undefined
      return result
    }
    result.src = imageSrc
    return result
  }, [
    imageSrc, 
    // props.activity.photoUrl
  ])

  const image = useMemo(() => calculateMemoImage(action), [action, calculateMemoImage])

  const styleText = {
    color: drawingColor
  }
  const styleLogoNama = {
    width: (ratio === '1:1') ? '10vw' : '15vw',
    height: (ratio === '1:1') ? '8vw' : '12vw',
    fill: drawingColor
  }
  const styleTextUnderSketch = {
    top: (ratio === '1:1') ? '82%' : '82%',
    color: drawingColor
  }
  // const styleFilter = {
  //   opacity: valueFilter / 100,
  //   backgroundColor: filterColor
  // }
  const classesName = ratio === '1:1' ? 'text-overlay text-title-props text-name-props' : 'text-overlay text-title-props-rect text-name-props'
  const classesDate = ratio === '1:1' ? 'text-overlay text-title-props text-date-props' : 'text-overlay text-title-props-rect text-date-props'
  const classesCoordinates = ratio === '1:1' ? 'text-overlay text-coordinates-props' : 'text-overlay text-coordinates-props text-coordinates-props-rect'
  const classesSketch = ratio === '1:1' ? 'canvas-filter canvas-sketch' : 'canvas-filter canvas-sketch-rect'
  const classesDataWrapper2Lines = ratio === '1:1' ? 'wrapper-data-2-lines' : 'wrapper-data-2-lines-rect'
  const classesDataWrapperLine = 'wrapper-data-line'
  const classesDataElement = ratio === '1:1' ? 'wrapper-data-element' : 'wrapper-data-element-rect'
  const classesDataPLittle = 'data-p-little'
  const classesLogoNama = ratio === '1:1' ? 'logo-nama-wrapper' : 'logo-nama-wrapper-rect'

  const handleDownloadClick = async () => {
    html2canvas(document.getElementById('printingAnchor')).then(async function(canvas) {
      const dataURL = canvas.toDataURL('image/jpeg');
      console.log('navigator.canShare', navigator.share)
      console.log('navigator.canShare', navigator)
      if(navigator.share) {
        try {
          await navigator.share({
            title: 'Share Image',
            text: 'Check out this image!',
            url: dataURL,
          });
        } catch (error) {
          console.error('Error sharing image:', error);
        }
      } else {
        const temp = document.createElement('a');
        temp.href = dataURL;
        temp.download = props.activity.beautyName.replaceAll(' ','_').toLowerCase() + '.jpeg'
        temp.click();
      }
    });

}
  const drawLine = useCallback((color) => {
    let coordinates = props.activity.coordinates
    let width = Math.min(canvasHeight, canvasWidth)
    let height = Math.min(canvasHeight, canvasWidth)
    let canvasSketch = document.getElementById('canvasSketch')
    let ctx = canvasSketch.getContext('2d')
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
    let zoomFactor = Math.min(width / mapWidth, height / mapHeight)
    console.log('zoomFactor:', zoomFactor)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = color
    ctx.lineWidth = width*0.01
    ctx.beginPath()
  
    for(let i = 0; i < coordinates.length; i++) {
      let c = coordinates[i]
      let rightHeight = height/2
      let rightZoomY = zoomFactor
      if(ratio !== '1:1') {
        rightHeight = rightHeight*1.77
        rightZoomY = zoomFactor*1.77
      }
      ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*rightZoomY + rightHeight)
      // ctx.lineTo((c[0]-mapCenterX)*zoomFactor + width/2, -(c[1]-mapCenterY)*zoomFactor + height/2)
    }

    ctx.stroke()

  },[props.activity.coordinates, ratio, canvasWidth, canvasHeight])


  const drawFilter = useCallback((v) => {
    if(!v) v = 0
    let canvasFilter = document.getElementById('canvasFilter')
    let ctx = canvasFilter.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = filterColor
    ctx.filter = 'opacity(' + valueFilter + '%)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, [
    valueFilter,
    filterColor, 
    canvasWidth, 
    canvasHeight])

  const handleClickDispatcher = (data) => {
    console.log('data:', data)
    if(data.type === 'filterSlider') {
      setValueFilter(data.value)
      drawFilter(data.value)
    }
    else if(data.type === 'share') handleDownloadClick()
    else if(data.type === 'changing-color') handleColorChange(data.color)
    else if(data.type === 'rectangle' || data.type === 'square') {
      setRatio(data.type === 'square' ? '1:1' : '9:16')
      handleCrop(data.type === 'square' ? '1:1' : '9:16')
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
        if(data.show) {
          setShowData(false)
        }
        if(data.show) {
          setShowDataUnique(false)
        }
      } else if(data.subtype === 'data') {
        setShowData(data.show)
        if(data.show) {
          setShowCoordinates(false)
        }
        if(data.show) {
          setShowDataUnique(false)
        }
      } else if(data.subtype === 'dataunique') {
        setShowDataUnique(data.show)
        if(data.show) {
          setShowCoordinates(false)
        }
        if(data.show) {
          setShowData(false)
        }
      }
    } else if(data.type === 'image') {
      setImage(data.image)
    }
  }

  const handleColorChange = (color) => {
    console.log('color to set', color)
    setDrawingColor(color)
    drawLine(color)
  }

  const handleCrop = useCallback((ratioText, imageSrc) => {
    if(ratioText) {
      console.log('ratioText:', ratioText)
      const imageReference = new Image()
      if(!imageSrc) {
        imageReference.src = image.src
      } else if(imageSrc) {
        imageReference.src = imageSrc
      }
      let imageReferenceWidth = imageReference.width
      let imageReferenceHeight = imageReference.height
      if(imageReferenceWidth === 0) {
        imageReferenceWidth = window.innerWidth * 80
        imageReferenceHeight = (window.innerWidth * 80) * (ratioText.split(':')[1]/ratioText.split(':')[0])
      }
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if(ratioText === '1:1') {
        let min = Math.min(imageReferenceWidth, imageReferenceHeight)
        let xCropTemp = imageReferenceWidth === imageReferenceHeight || imageReferenceWidth < imageReferenceHeight ? 0 : (imageReferenceWidth - min) / 2
        let yCropTemp = imageReferenceWidth === imageReferenceHeight || imageReferenceWidth > imageReferenceHeight ? 0 : (imageReferenceHeight - min) / 2
        setXCrop(xCropTemp)
        setYCrop(yCropTemp)
        setCanvasWidth(min)
        setCanvasHeight(min)
        imageReference.onload = () => {
          ctx.rect(0,0,min, min);
          ctx.drawImage(imageReference, xCropTemp, yCropTemp, min, min, 0, 0, min, min)
          drawLine(drawingColor)
          drawFilter()
        }
      } else {
        let ratioSplitted = ratioText.split(':')
        let ratioCalculated = ratioSplitted[0]/ratioSplitted[1]
        let min = Math.min(imageReferenceWidth, imageReferenceHeight * ratioCalculated)
        let widthRationalized = (imageReferenceWidth === min) ? imageReferenceWidth : imageReferenceHeight * ratioCalculated
        let heightRationalized = (imageReferenceHeight * ratioCalculated === min) ? imageReferenceHeight : imageReferenceWidth / ratioCalculated
        let xCropTemp = widthRationalized === imageReferenceHeight * ratioCalculated || imageReferenceWidth < imageReferenceHeight * ratioCalculated ? 0 : (imageReferenceWidth - widthRationalized) / 2
        let yCropTemp = widthRationalized === imageReferenceHeight * ratioCalculated || imageReferenceWidth > imageReferenceHeight * ratioCalculated ? 0 : (imageReferenceHeight - heightRationalized) / 2
        setXCrop(xCropTemp)
        setYCrop(yCropTemp)
        setCanvasWidth(widthRationalized)
        setCanvasHeight(heightRationalized)
        imageReference.onload = () => {
          ctx.rect(0,0,min, min);
          ctx.drawImage(imageReference, xCropTemp, yCropTemp, widthRationalized, heightRationalized, 0, 0, heightRationalized, heightRationalized)
          drawLine(drawingColor)
          drawFilter()
        }
      }
      setRatio(ratioText)
      setIsCropped(true);
    }
  }, [
    drawFilter,
    drawLine, 
    image, 
    drawingColor])

  const setImage = (imageSrc) => {
    setImageSrc(imageSrc)
    handleCrop(ratio, imageSrc)
  }

  const returnBeautyData = () => {
    let line1 = []
    let line2 = []
    if(showDistance) line1.push(<div key="distance" className={classesDataElement}><p className={classesDataPLittle}>Distance</p><p>{props.activity.beautyDistance}</p></div>)
    if(showElevation) line1.push(<div key="elevation" className={classesDataElement}><p className={classesDataPLittle}>Elevation</p><p>{props.activity.beautyElevation}</p></div>)
    if(showDuration) line1.push(<div key="duration" className={classesDataElement}><p className={classesDataPLittle}>Duration</p><p>{props.activity.beautyDuration}</p></div>)
    if(showPower) line2.push(<div key="power" className={classesDataElement}><p className={classesDataPLittle}>Power</p><p>{props.activity.beautyPower}</p></div>)
    if(showAverage) line2.push(<div key="average" className={classesDataElement}><p className={classesDataPLittle}>Average</p><p>{props.activity.beautyAverage}</p></div>)
    return(<div id="canvasText" style={styleText} className={classesDataWrapper2Lines}>
      <div className={classesDataWrapperLine}>
        {line1}
      </div>
      <div className={classesDataWrapperLine}>
        {line2}
      </div>
    </div>)
  }


  useEffect(() => {
    // const canvas = canvasRef.current
    // const ctx = canvas.getContext('2d')
    handleCrop(ratio)
    // if (canvas && canvasWidth && canvasHeight) {
    //   image.onload = () => {
    //     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //     ctx.drawImage(image, xCrop, yCrop, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
    //     drawLine(drawingColor)
    //     drawFilter()
    //   }
    // } else if(!canvasWidth && !canvasHeight) {
    //   handleCrop(ratio)
    // }
  }, [
      drawLine,
      drawFilter,
      handleCrop,
      image, 
      xCrop, 
      yCrop, 
      canvasWidth, 
      canvasHeight, 
      props.activity.photoUrl,
      props.activity.coordinates, 
      drawingColor, 
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
      <div className="beauty-border">
        <div ref={imageRef} className="canvas-container" id="printingAnchor">
            <canvas id="canvasImage" className="canvas-image" ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
            <canvas id="canvasFilter" className="canvas-filter" width={canvasWidth} height={canvasHeight}/>
            <canvas id="canvasSketch" className={classesSketch} width={canvasWidth} height={canvasHeight}/>
            {showTitle && (
              <div className="text-overlay text-title">
                <div id="canvasText" style={styleText} className={classesName}>{props.activity.beautyName}</div>
                {showDate && (<div id="canvasText" style={styleText} className={classesDate}>{props.activity.beautyDate}</div>)}
              </div>
            )}
            {/* {showName && (<div id="canvasText" style={styleText} className="text-overlay text-name">{props.activity.beautyName}</div>)}
            {showDate && (<div className="text-overlay text-date">{props.activity.beautyDate}</div>)}
            {showDistance && (<div className="text-overlay text-distance">{props.activity.beautyDistance}</div>)}
            {showDuration && (<div className="text-overlay text-duration">{props.activity.beautyDuration}</div>)}
            {showElevation && (<div className="text-overlay text-elevation">{props.activity.beautyElevation}</div>)}
            {showAverage && (<div className="text-overlay text-average">{props.activity.beautyAverage}</div>)}
            {showPower && (<div className="text-overlay text-power">{props.activity.beautyAverage}</div>)} */}
            <div className={classesLogoNama}>
              <LogoNameSVG className="logo-nama-svg" style={styleLogoNama}/>
            </div>
            {showCoordinates && (<div id="canvasText" style={styleTextUnderSketch} className={classesCoordinates}>{props.activity.beautyCoordinates}</div>)}
            {showDataUnique && returnBeautyData()}
            {showData && (<div id="canvasText" style={styleTextUnderSketch} className={classesCoordinates}>{props.activity.beautyData}</div>)}
        </div>
      </div>
      {/* <CachedImage photoUrl={props.activity.photoUrl}/> */}
      <ButtonImage className="indexed-height" activity={props.activity} handleClickButton={handleClickDispatcher}/>
    </div>
  );
}

export default ImageComponent