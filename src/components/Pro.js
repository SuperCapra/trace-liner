import '../App.css';
import './Pro.css';
import React, {useState, useEffect, useRef} from 'react';
import {ReactComponent as ButtonGpxSVG} from '../assets/images/buttonGpx.svg'
import { vocabulary } from '../config/vocabularyPro';
import GPXParser from 'gpxparser';
import LoaderLogo from './LoaderLogo';
import Modal from './Modal';
import he from 'he';
import utils from '../utils/proUtils';
import u from '../utils/utils';
import brandingPalette from '../config/brandingPalette';

function Pro(props) {
    const {language} = props
    const svgRef = useRef(null)

    const getWidth = () => {
        console.log('getWidth')
        const widthScreen = window.innerWidth;
        return widthScreen * 0.8
    }  
    const getHeight = () => {
        const widthScreen = window.innerHeight;
        return widthScreen * 0.4
    }  

    const [loadedGPX, setLoadedGPX] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [width, setWidth] = useState(getWidth())
    const [height, setHeight] = useState(getHeight())
    const [heightAltitude, setHeightAltitude] = useState(getHeight())
    const [gpxInfo, setGpxInfo] = useState(undefined)
    const [type, setType] = useState('route')
    const [resolution, setResolution] = useState(50)
    const [altitudePadding, setAltitudePadding] = useState(10)
    const [thickness, setThickness] = useState(2)
    const [isMobile, setIsMobile] = useState(u.isMobile())
    const [fillAltitude, setFillAltitude] = useState(true)
    const [underBorder, setUnderBorder] = useState(true)

    const loadGPX = () => {
        console.log('loadedGPX', loadedGPX)
        const gpxInput = document.getElementById('gpxInput')
        if(gpxInput) gpxInput.click()
    }

    const changeType = (typeSetting) => {
        setType(typeSetting)
    }

    const increaseResolution = () => {
        console.log('increaseResolution, resolution:', resolution)
        setResolution(Math.min(resolution + 5,100))
        normalizeGpxInfo(gpxInfo, width, height, Math.min(resolution + 5,100), altitudePadding, thickness, underBorder)
    }
    const decreaseResolution = () => {
        console.log('decreaseResolution, resolution:', resolution)
        setResolution(Math.max(resolution - 5,1))
        normalizeGpxInfo(gpxInfo, width, height, Math.max(resolution - 5,1), altitudePadding, thickness, underBorder)
    }
    const changeResolution = (event) => {
        let value = Math.max(Math.min(event.target.value,100),0)
        value = isNaN(value) ? 50 : value
        setResolution(value)
        normalizeGpxInfo(gpxInfo, width, height, value, altitudePadding, thickness, underBorder)
    }
    const increasePadding = () => {
        setAltitudePadding(Math.min(altitudePadding + 5,100))
        normalizeGpxInfo(gpxInfo, width, height, resolution, Math.min(altitudePadding + 5,100), thickness, underBorder)
    }
    const decreasePadding = () => {
        setAltitudePadding(Math.max(altitudePadding - 5,1))
        normalizeGpxInfo(gpxInfo, width, height, resolution, Math.max(altitudePadding - 5,1), thickness, underBorder)
    }
    const changePadding = (event) => {
        let value = Math.max(Math.min(event.target.value,100),0)
        value = isNaN(value) ? 50 : value
        setAltitudePadding(value)
        normalizeGpxInfo(gpxInfo, width, height, resolution, value, thickness, underBorder)
    }
    const increaseThickness = () => {
        setThickness(Math.min(thickness + 1,10))
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePadding, Math.min(thickness + 1,10), underBorder)
    }
    const decreaseThickness = () => {
        setThickness(Math.max(thickness - 1,0))
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePadding, Math.max(thickness - 1,1), underBorder)
    }
    const changeThickness = (event) => {
        let value = Math.max(Math.min(event.target.value,10),0)
        value = isNaN(value) ? 2 : value
        setThickness(value)
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePadding, value, underBorder)
    }
    const downloadSVG = () => {
        const svgElement = svgRef.current
        const serializer = new XMLSerializer()
        const source = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + serializer.serializeToString(svgElement)
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
    
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = (props.name ? props.name : 'image') + '.svg'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const changeFillAltitude = () => {
        setFillAltitude(!fillAltitude)
    }
    const changeUnderBorder = () => {
        if(underBorder && fillAltitude) setFillAltitude(false)
        setUnderBorder(!underBorder)
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePadding, thickness, !underBorder)
    }

    const normalizeGpxInfo = (t,w,h,r,p,ti,ub) => {
        console.log('normalizeGpxInfo, resolution:', resolution)
        if(!t && gpxInfo) t = gpxInfo
        if(!w) w = getWidth()
        if(!h) h = getHeight()
        if(!r) r = resolution
        if(!p) p = altitudePadding
        if(!ti) ti = thickness
        t['routePath'] = utils.getRoutePath(utils.normalizeCoordinates(t.coordinates, w, h, r))
        let altitudeInformation = utils.getAltitudePath(utils.normalizeAltitude(t.altitudeStream, w, h, r, ti), h, p, t.altitudeStream, ub)
        t['altitudePath'] = altitudeInformation.pathData
        setHeightAltitude(altitudeInformation.heightAltitude)
        console.log('gpxInfo:', t)
        setGpxInfo(t)
    }

    const processGPX = (event) => {
        console.log('processGPX, event:', event)
        setIsLoading(true)
        if(event && event.target && event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            const reader = new FileReader();
            let tempGpxInfo = {}
            reader.onload = (e) => {
                let gpxFile = e.target.result
                const gpx = new GPXParser()
                gpx.parse(gpxFile)
                console.log('gpx.metadata.time: ', gpx.metadata.time)
                console.log('gpx:', gpx)
                console.log('unix time stamp in seconds', Math.floor(gpx.tracks[0].points[0].time)/1000)
                const tracks = gpx.tracks.map(track => ({
                    altitudeStream: [...track.points.map(point => (point.ele))],
                    coordinates: track.points && track.points.length ? track.points.map(point => ([
                        point.lon,
                        point.lat
                    ])) : undefined,
                    timingStreamSeconds: track.points && track.points.length ? [...track.points.map(point => (Math.floor(point.time) / 1000))] : undefined,
                    name: track.name ? he.decode(track.name) : undefined,
                }))
                tempGpxInfo = tracks[0]
                normalizeGpxInfo(tempGpxInfo, width, height, resolution, altitudePadding, thickness, underBorder)
            }

            reader.readAsText(file);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if(!gpxInfo) return
        const handleResize = () => {
            const tempW = getWidth()
            const tempH = getHeight()
            setWidth(tempW)
            setHeight(tempH)
            normalizeGpxInfo(gpxInfo, tempW, tempH, resolution, altitudePadding, thickness, underBorder)
        }
        window.addEventListener("resize", handleResize)
        setLoadedGPX(true)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    },[
        gpxInfo,
        resolution
    ])

    const buttons = () => {
        return(<div>
                <div className="wrapper-title-logo margin-title-logo-pro">
                    <p className="p-color p-dimention-xl p-uppercase">{vocabulary[language].BUTTON_TITLE}</p>
                </div>
                <div className="wrapper-button-login" onClick={() => loadGPX()}>
                    <ButtonGpxSVG className="homepage-button"></ButtonGpxSVG>
                    <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} onChange={processGPX}/>
                </div>
            </div>)
    }

    const styleAltitude = {
        stroke: brandingPalette.primary,
        strokeWidth: thickness,
        fill: fillAltitude ? brandingPalette.primary : 'none',
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }
    const styleRoute = {
        stroke: brandingPalette.primary,
        strokeWidth: thickness,
        fill: 'none',
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }

    const handleBack = () => {
        setLoadedGPX(false)
        setGpxInfo(undefined)
    }

    const getClassesRouteButton = () => {
        let c = 'button-action button-primary-shorter justify-center-column button-margin-horizontal'
        if(type === 'route') c += ' button-secondary-color'
        else c += ' button-bordered'
        return c
    }
    const getClassesAltitudeButton = () => {
        let c = 'button-action button-primary-shorter justify-center-column button-margin-horizontal'
        if(type === 'altitude') c += ' button-secondary-color'
        else c += ' button-bordered'
        return c
    }
    const classesRouteButton = getClassesRouteButton()
    const classesAltitudeButton = getClassesAltitudeButton()

    const svgCreator = () => {
        console.log('svgCreator, gpxInfo:', gpxInfo)
        return(<div className="pro-container">
            <div className="buttons-wrapper-header">
                <div className="buttons-wrapper-header-row-1">
                    <div className="button-action back-button" onClick={() => handleBack()}>
                        <div className="back-text-container">
                            <p className="p-dimention p-left p-color p-centering">{vocabulary[language].BUTTON_BACK}</p>
                        </div>
                    </div>
                    <div className="buttons-wrapper-type">
                        <div className={classesRouteButton} onClick={() => changeType('route')}>
                            <p className="p-color p-uppercase p-dimention p-centering" >{vocabulary[language].BUTTON_ROUTE}</p>
                        </div>
                        <div className={classesAltitudeButton} onClick={() => changeType('altitude')}>
                            <p className="p-color p-uppercase p-dimention p-centering">{vocabulary[language].BUTTON_ALTITUDE}</p>
                        </div>
                    </div>
                    <div className="button-action button-primary-shorter button-primary-color justify-center-column" onClick={downloadSVG}>
                        <p className="p-color-secondary p-uppercase p-dimention p-centering">{vocabulary[language].BUTTON_GET_SVG}</p>
                    </div>
                </div>
                <div className="buttons-wrapper-header-row-2">
                    <div className="wrapper-controller">
                        <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_RESOLUTION}</p>
                        <div className="buttons-wrapper-resolution">
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={decreaseResolution}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">-</p>
                            </div>
                            <div>
                                <input type="text" className="p-dimention p-color-secondary p-centering input-resolution" value={resolution} onChange={changeResolution}/>
                            </div>
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={increaseResolution}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">+</p>
                            </div>
                        </div>
                    </div>
                    <div className="wrapper-controller margin-left">
                        <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_THICKNESS}</p>
                        <div className="buttons-wrapper-resolution">
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={decreaseThickness}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">-</p>
                            </div>
                            <div>
                                <input type="text" className="p-dimention p-color-secondary p-centering input-resolution" value={thickness} onChange={changeThickness}/>
                            </div>
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={increaseThickness}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">+</p>
                            </div>
                        </div>
                    </div>
                    {type === 'altitude' && <div className="wrapper-controller margin-left">
                        <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_BOTTOM_PADDING}</p>
                        <div className="buttons-wrapper-resolution">
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={decreasePadding}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">-</p>
                            </div>
                            <div>
                                <input type="text" className="p-dimention p-color-secondary p-centering input-resolution" value={altitudePadding} onChange={changePadding}/>
                            </div>
                            <div className="button-action button-controller button-primary-color justify-center-column" onClick={increasePadding}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">+</p>
                            </div>
                        </div>
                    </div>}
                    {type === 'altitude' && <div className="wrapper-controller margin-left">
                        <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_FILL}</p>
                        <div className="buttons-wrapper-resolution button-controller button-action" onClick={changeFillAltitude}>
                            <p className="p-color-secondary p-uppercase p-dimention p-centering">{String(fillAltitude)}</p>
                        </div>
                    </div>}
                    {type === 'altitude' && <div className="wrapper-controller margin-left">
                        <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_UNDER_BORDER}</p>
                        <div className="buttons-wrapper-resolution button-controller button-action" onClick={changeUnderBorder}>
                            <p className="p-color-secondary p-uppercase p-dimention p-centering">{String(underBorder)}</p>
                        </div>
                    </div>}
                </div>
            </div>
            {type === 'route' && <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
                <path d={gpxInfo.routePath} style={styleRoute}/>
            </svg>}
            {type === 'altitude' && <div style={{height: height}} className="svg-altitude-container">
                <svg ref={svgRef} width={width} height={heightAltitude} viewBox={`0 0 ${width} ${heightAltitude}`} xmlns="http://www.w3.org/2000/svg">
                    <path d={gpxInfo.altitudePath} style={styleAltitude}/>
                </svg>
            </div>}
        </div>)
    }

    const closeModal = () => {
        setIsMobile(false)
    }

    return (<div>
        {isMobile && <Modal message={vocabulary[language].TEXT_MODAL_MOBILE} handleCloseModal={() => closeModal()}/>}
        {isLoading && <LoaderLogo/>}
        {!isLoading && <div>
            {!loadedGPX && buttons()}
            {loadedGPX && gpxInfo && svgCreator()}
        </div>}
    </div>)
}

export default Pro