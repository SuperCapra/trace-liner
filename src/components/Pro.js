import '../App.css';
import './Pro.css';
import React, {useState, useEffect, useRef} from 'react';
import {ReactComponent as ButtonGpxSVG} from '../assets/images/buttonGpx.svg'
import { vocabulary } from '../config/vocabularyPro';
import GPXParser from 'gpxparser';
import LoaderLogo from './LoaderLogo';
import he from 'he';
import utils from '../utils/proUtils';
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
    const [gpxInfo, setGpxInfo] = useState(undefined)
    const [type, setType] = useState('altitude')

    const loadGPX = () => {
        console.log('loadedGPX', loadedGPX)
        const gpxInput = document.getElementById('gpxInput')
        if(gpxInput) gpxInput.click()
    }

    const changeType = (typeSetting) => {
        setType(typeSetting)
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

    const normalizeGpxInfo = (t,w,h) => {
        if(!t && gpxInfo) t = gpxInfo
        if(!w) w = getWidth()
        if(!h) h = getHeight()
        t['routePath'] = utils.getRoutePath(utils.normalizeCoordinates(t.coordinates, w, h))
        t['altitudePath'] = utils.getAltitudePath(utils.normalizeAltitude(t.altitudeStream, w, h),h)
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
                normalizeGpxInfo(tempGpxInfo, width, height)
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
            normalizeGpxInfo(gpxInfo, tempW, tempH)
        }
        window.addEventListener("resize", handleResize)
        setLoadedGPX(true)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    },[
        gpxInfo
    ])

    const buttons = () => {
        return(<div>
                <div className="wrapper-title-logo margin-title-logo">
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
        strokeWidth: 2,
        fill: brandingPalette.primary,
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }
    const styleRoute = {
        stroke: brandingPalette.primary,
        strokeWidth: 2,
        fill: 'none',
        strokeLinecap: 'none',
        strokeLinejoin: 'round'
    }

    const handleBack = () => {
        setLoadedGPX(false)
        setGpxInfo(undefined)
    }

    const getClassesRouteButton = () => {
        let c = 'button-action button-primary-shorter justify-center-column'
        if(type === 'route') c += ' button-secondary-color'
        return c
    }
    const getClassesAltitudeButton = () => {
        let c = 'button-action button-primary-shorter justify-center-column'
        if(type === 'altitude') c += ' button-secondary-color'
        return c
    }
    const classesRouteButton = getClassesRouteButton()
    const classesAltitudeButton = getClassesAltitudeButton()

    const svgCreator = () => {
        console.log('svgCreator, gpxInfo:', gpxInfo)
        return(<div>
            <div className="buttons-wrapper">
                <div className="button-action back-button" onClick={() => handleBack()}>
                    <div className="back-text-container">
                        <p className="p-dimention p-left p-color">{vocabulary[language].BUTTON_BACK}</p>
                    </div>
                </div>
                <div className={classesRouteButton} onClick={() => changeType('route')}>
                    <p className="p-color p-uppercase p-dimention">{vocabulary[language].BUTTON_ROUTE}</p>
                </div>
                <div className={classesAltitudeButton} onClick={() => changeType('altitude')}>
                    <p className="p-color p-uppercase p-dimention">{vocabulary[language].BUTTON_ALTITUDE}</p>
                </div>
                <div className="button-action button-primary-shorter button-primary-color justify-center-column" onClick={downloadSVG}>
                    <p className="p-color-secondary p-uppercase p-dimention">{vocabulary[language].BUTTON_GET_SVG}</p>
                </div>
            </div>
            {type === 'route' && <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
                <path d={gpxInfo.routePath} style={styleRoute}/>
            </svg>}
            {type === 'altitude' && <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
                <path d={gpxInfo.altitudePath} style={styleAltitude}/>
            </svg>}
        </div>)
    }

    return (<div>
        {isLoading && <LoaderLogo/>}
        {!isLoading && <div>
            {!loadedGPX && buttons()}
            {loadedGPX && gpxInfo && svgCreator()}
        </div>}
    </div>)
}

export default Pro