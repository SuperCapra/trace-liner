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

function ButtonImage() {
    const [showModifyImage, setModifyImgae] = useState(false);
    const [showModifyText, setModifyText] = useState(false);
    const [showName, setShowName] = useState(false);
    const [showDistance, setShowDistance] = useState(false);
    const [showDuration, setShowDuration] = useState(false);
    const [showAverage, setShowAverage] = useState(false);
    const [showPower, setShowPower] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(false);

    const showModifySetImage = () => {
        setModifyText(false)
        setModifyImgae(!showModifyImage)
    }
    const showModifySetText = () => {
        setModifyImgae(false)
        setModifyText(!showModifyText)
    }

    const shareStyle = {
        fill: brandingPalette.pink,
        // margin: '1vw 2vw 1vw 2vw',
        transform: 'scale(0.5)'
    }
    const modifyStyle = {
        fill: brandingPalette.pink,
        // margin: '1vw 2vw 1vw 2vw',
        transform: 'scale(0.5)'
    }

    const returnsColors = () => {
        let colors = []
        for(let color in brandingPalette) {
            let styleColor = {
                'background-color': brandingPalette[color],
                'width': '20px',
                'height': '20px',
                'border-radius': '20px'
            }
            colors.push(<div className="colors" key={color} style={styleColor} onClick={() => this.props.changeColor(brandingPalette[color])}/>)
        }
        console.log('colors', colors)
        return (colors)
    }

    const eyeName = () => {
        return(
            <div>
                {showName && (<ViewSVG style={modifyStyle} onClick={() => setShowName(!showName)} />)}
                {!showName && (<HideSVG style={modifyStyle} onClick={() => setShowName(!showName)} />)}
            </div>
        )
    }
    const eyeDistance = () => {
        return(
            <div>
                {showDistance && (<ViewSVG style={modifyStyle} onClick={() => setShowDistance(!showDistance)} />)}
                {!showDistance && (<HideSVG style={modifyStyle} onClick={() => setShowDistance(!showDistance)} />)}
            </div>
        )
    }
    const eyeDuration = () => {
        return(
            <div>
                {showDuration && (<ViewSVG style={modifyStyle} onClick={() => setShowDuration(!showDuration)} />)}
                {!showDuration && (<HideSVG style={modifyStyle} onClick={() => setShowDuration(!showDuration)} />)}
            </div>
        )
    }
    const eyePower = () => {
        return(
            <div>
                {showPower && (<ViewSVG style={modifyStyle} onClick={() => setShowPower(!showPower)} />)}
                {!showPower && (<HideSVG style={modifyStyle} onClick={() => setShowPower(!showPower)} />)}
            </div>
        )
    }
    const eyeCoordinates = () => {
        return(
            <div>
                {showCoordinates && (<ViewSVG style={modifyStyle} onClick={() => setShowCoordinates(!showCoordinates)} />)}
                {!showCoordinates && (<HideSVG style={modifyStyle} onClick={() => setShowCoordinates(!showCoordinates)} />)}
            </div>
        )
    }

    return (
        <div>
            <div className="wrapper-buttons">
                <div style={modifyStyle} onClick={() => showModifySetText()}>
                    <TextSVG />
                </div>
                <div style={modifyStyle} onClick={() => showModifySetImage()}>
                    <ModifySVG />
                </div>
                <div style={shareStyle} onClick={() => this.props.clickShare()}>
                    <ShareSVG />
                </div>
            </div>
            {showModifyImage && (
                <div>
                    <div className="wrapper-buttons">
                        <RectangleSVG style={modifyStyle} onClick={() => this.props.setSquare()}/>
                        <SquareSVG style={modifyStyle} onClick={() => this.props.setRectangle()}/>
                    </div>
                    <div className="wrapper-buttons">
                        {returnsColors()}
                    </div>
                </div>
            )}
            {showModifyText && (
                <div>
                    <div className="wrapper-buttons">
                        {eyeName()}
                        <p>NAME</p>
                    </div>
                    <div className="wrapper-buttons">
                        {eyeDistance()}
                        <p>DISTANCE</p>
                    </div>
                    <div className="wrapper-buttons">
                        {eyeDuration()}
                        <p>DURATION</p>
                    </div>
                    <div className="wrapper-buttons">
                        {eyePower()}
                        <p>POWER</p>
                    </div>
                    <div className="wrapper-buttons">
                        {eyeCoordinates()}
                        <p>COORDINATES</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ButtonImage;