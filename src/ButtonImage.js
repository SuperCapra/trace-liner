import './App.css';
import React, {useState} from 'react';
import {ReactComponent as ShareSVG} from './share.svg'
import {ReactComponent as ModifySVG} from './modify.svg'
import {ReactComponent as TextSVG} from './text.svg'
import {ReactComponent as RectangleSVG} from './rectangle.svg'
import {ReactComponent as SquareSVG} from './square.svg'
import {ReactComponent as ViewSVG} from './view.svg'
import {ReactComponent as HideSVG} from './hide.svg'
import brandingPalette from './brandingPalette';

function ButtonImage({onClickButton}) {
    const [showModifyImage, setModifyImgae] = useState(false);
    const [showModifyText, setModifyText] = useState(false);
    const [square, setSquare] = useState(false);
    const [rectangle, setRectangle] = useState(false);
    const [showName, setShowName] = useState(false);
    const [showDistance, setShowDistance] = useState(false);
    const [showDuration, setShowDuration] = useState(false);
    const [showAverage, setShowAverage] = useState(false);
    const [showPower, setShowPower] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(false);
    const colors = []

    const showModifySetImage = () => {
        setModifyText(false)
        setModifyImgae(!showModifyImage)
    }
    const showModifySetText = () => {
        setModifyImgae(false)
        setModifyText(!showModifyText)
    }

    const handleClick = (data) => {
        onClickButton(data)
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

    const shareStyle = {
        fill: brandingPalette.pink,
        transform: 'scale(0.5)'
    }
    const modifyStyle = {
        fill: showModifyImage ? brandingPalette.yellow : brandingPalette.pink,
        transform: 'scale(0.5)'
    }
    const textStyle = {
        fill: showModifyText ? brandingPalette.yellow : brandingPalette.pink,
        transform: 'scale(0.5)'
    }
    const squareStyle = {
        fill: square ? brandingPalette.yellow : brandingPalette.pink,
        transform: 'scale(0.5)'
    }
    const rectangleStyle = {
        fill: rectangle ? brandingPalette.yellow : brandingPalette.pink,
        transform: 'scale(0.5)'
    }
    const eyeStyle = {
        fill: brandingPalette.pink,
        transform: 'scale(0.5)'
    }

    const returnsColors = () => {
        if(!colors.length) {
            for(let color in brandingPalette) {
                let styleColor = {
                    backgroundColor: brandingPalette[color],
                    width: '20px',
                    height: '20px',
                    borderRadius: '20px',
                    border: '2px solid ' + brandingPalette['background']
                }
                colors.push(<div className="colors" key={color} style={styleColor} onClick={() => handleClick({type: 'changing-color', color: brandingPalette[color]})}/>)
            }
            console.log('colors', colors)
        }
        return (colors)
    }

    const eyeName = () => {
        return(
            <div>
                {showName && (<ViewSVG style={eyeStyle} onClick={() => setShowName(!showName)} />)}
                {!showName && (<HideSVG style={eyeStyle} onClick={() => setShowName(!showName)} />)}
            </div>
        )
    }
    const eyeDistance = () => {
        return(
            <div>
                {showDistance && (<ViewSVG style={eyeStyle} onClick={() => setShowDistance(!showDistance)} />)}
                {!showDistance && (<HideSVG style={eyeStyle} onClick={() => setShowDistance(!showDistance)} />)}
            </div>
        )
    }
    const eyeDuration = () => {
        return(
            <div>
                {showDuration && (<ViewSVG style={eyeStyle} onClick={() => setShowDuration(!showDuration)} />)}
                {!showDuration && (<HideSVG style={eyeStyle} onClick={() => setShowDuration(!showDuration)} />)}
            </div>
        )
    }
    const eyeAverage = () => {
        return(
            <div>
                {showAverage && (<ViewSVG style={eyeStyle} onClick={() => setShowAverage(!showAverage)} />)}
                {!showAverage && (<HideSVG style={eyeStyle} onClick={() => setShowAverage(!showAverage)} />)}
            </div>
        )
    }
    const eyePower = () => {
        return(
            <div>
                {showPower && (<ViewSVG style={eyeStyle} onClick={() => setShowPower(!showPower)} />)}
                {!showPower && (<HideSVG style={eyeStyle} onClick={() => setShowPower(!showPower)} />)}
            </div>
        )
    }
    const eyeCoordinates = () => {
        return(
            <div>
                {showCoordinates && (<ViewSVG style={eyeStyle} onClick={() => setShowCoordinates(!showCoordinates)} />)}
                {!showCoordinates && (<HideSVG style={eyeStyle} onClick={() => setShowCoordinates(!showCoordinates)} />)}
            </div>
        )
    }

    // const handleShare = () => {
    //     onClickShare()
    // }

    return (
        <div>
            <div className="wrapper-buttons">
                <div style={textStyle} onClick={() => showModifySetText()}>
                    <TextSVG />
                </div>
                <div style={modifyStyle} onClick={() => showModifySetImage()}>
                    <ModifySVG />
                </div>
                <div style={shareStyle} onClick={() => handleClick({type: 'share'})}>
                    <ShareSVG />
                </div>
            </div>
            {showModifyImage && (
                <div>
                    <div className="wrapper-buttons">
                        <RectangleSVG style={rectangleStyle} onClick={() => propagateRectangle()}/>
                        <SquareSVG style={squareStyle} onClick={() => propagateSquare()}/>
                    </div>
                    <div className="wrapper-buttons colors-background">
                        {returnsColors()}
                    </div>
                </div>
            )}
            {showModifyText && (
                <div>
                    <div className="wrapper-buttons-left">
                        {eyeName()}
                        <p>NAME</p>
                    </div>
                    <div className="wrapper-buttons-left">
                        {eyeDistance()}
                        <p>DISTANCE</p>
                    </div>
                    <div className="wrapper-buttons-left">
                        {eyeDuration()}
                        <p>DURATION</p>
                    </div>
                    <div className="wrapper-buttons-left">
                        {eyeAverage()}
                        <p>AVERAGE</p>
                    </div>
                    <div className="wrapper-buttons-left">
                        {eyePower()}
                        <p>POWER</p>
                    </div>
                    <div className="wrapper-buttons-left">
                        {eyeCoordinates()}
                        <p>COORDINATES</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ButtonImage