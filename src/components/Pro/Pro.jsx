import '../../App.css';
import './Pro.css';
import {useState, useEffect, useRef, useCallback} from 'react';
import ButtonGpxSVG from '../../assets/images/buttonGpx.svg?react'
import { vocabulary } from '../../config/vocabularyPro';
import { XMLParser } from "fast-xml-parser";
import LoaderLogo from '../LoaderLogo/LoaderLogo';
import Modal from '../ModalExport/ModalExport';
import he from 'he';
import utils from '../../utils/proUtils';
import u from '../../utils/utils';
import brandingPalette from '../../config/brandingPalette';
import apiUtils from '../../utils/apiUtils';
import dbInteractions from '../../services/dbInteractions';

function Pro(props) {
    const {language} = props
    const svgRef = useRef(null)

    const getWidth = () => {
        const widthScreen = window.innerWidth;
        return widthScreen * 0.8
    }  
    const getHeight = () => {
        const widthScreen = window.innerHeight;
        return widthScreen * 0.4
    }  

    const createVisitPro = () => {
        dbInteractions.createRecordNonEditable('visits_pro', import.meta.env.VITE_JWT_TOKEN, apiUtils.getVisitProBody()).then(res => {
            setVisitId(res)
        }).catch(e => {
          console.error('error creating the visit for the pro:', e)
        })
    }

    // const [loadedGPX, setLoadedGPX] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [width, setWidth] = useState(getWidth())
    const [height, setHeight] = useState(getHeight())
    const [widthSvg, setWidthSvg] = useState(getWidth())
    const [heightSvg, setHeightSvg] = useState(getHeight())
    const [gpxInfo, setGpxInfo] = useState(undefined)
    const [type, setType] = useState('route')
    const [resolution, setResolution] = useState(50)
    const [altitudePadding, setAltitudePadding] = useState(10)
    const [thickness, setThickness] = useState(2)
    const [isMobile, setIsMobile] = useState(u.isMobile())
    const [fillAltitude, setFillAltitude] = useState(true)
    const [underBorder, setUnderBorder] = useState(true)
    const [visitId, setVisitId] = useState(undefined)

    const loadGPX = () => {
        const gpxInput = document.getElementById('gpxInput')
        if(gpxInput) gpxInput.click()
    }

    const changeType = (typeSetting) => {
        setType(typeSetting)
        setWidthSvg(typeSetting === 'altitude' ? width : gpxInfo.routeWidth)
        setHeightSvg(typeSetting === 'altitude' ? gpxInfo.altitudeHeight : gpxInfo.routeHeight)
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
    const handlePadding = (value) => {
        let thicknessTemp = thickness
        value = isNaN(value) ? 50 : value
        if(value < thicknessTemp && underBorder) {
            thicknessTemp = Math.max(value,1)
            setThickness(thicknessTemp)
        }
        setAltitudePadding(value)
        normalizeGpxInfo(gpxInfo, width, height, resolution, value, thicknessTemp, underBorder)
    }
    const increasePadding = () => {
        let value = Math.min(altitudePadding + 5,100)
        handlePadding(value)
    }
    const decreasePadding = () => {
        let value = Math.max(altitudePadding - 5,1)
        handlePadding(value)
    }
    const changePadding = (event) => {
        let value = Math.max(Math.min(event.target.value,100),0)
        handlePadding(value)
    }
    const handleTickness = (value) => {
        let altitudePaddingTemp = altitudePadding
        value = isNaN(value) ? 2 : value
        if(value > altitudePaddingTemp && underBorder) {
            altitudePaddingTemp = Math.min(value,100)
            setAltitudePadding(altitudePaddingTemp)
        }
        setThickness(value)
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePaddingTemp, value, underBorder)
    }
    const increaseThickness = () => {
        let newTickness = Math.min(thickness + 1,10)
        handleTickness(newTickness)
    }
    const decreaseThickness = () => {
        let newTickness = Math.max(thickness - 1,1)
        handleTickness(newTickness)
    }
    const changeThickness = (event) => {
        let value = Math.max(Math.min(event.target.value,10),0)
        handleTickness(value)
    }
    const downloadSVG = () => {
        createExport()
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
        if(thickness === 0) {
            setThickness(2)
            normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePadding, 2, underBorder)
        }
    }
    const changeUnderBorder = () => {
        if(underBorder && fillAltitude) setFillAltitude(false)
        let altitudePaddingTemp = altitudePadding
        if(thickness / 2 > altitudePaddingTemp && !underBorder) {
            altitudePaddingTemp = Math.min(thickness / 2,100)
            setAltitudePadding(altitudePaddingTemp)
        }
        setUnderBorder(!underBorder)
        normalizeGpxInfo(gpxInfo, width, height, resolution, altitudePaddingTemp, thickness, !underBorder)
    }
    const updateVisits = (field, value) => {
        let body = {}
        body[field] = value
        dbInteractions.updateRecordEditable('visits_pro', import.meta.env.VITE_JWT_TOKEN, visitId, body).then(res => {
            console.log('updated visit pro:', res)
        }).catch(e => {
            console.error('error updating the visit pro:', e)
        })
    }
    const createExport = () => {
        let body = apiUtils.getExportProBody()
        body.visit_pro_id = visitId
        body.thickness = thickness
        body.resolution = resolution
        body.padding = type === 'altitude' ? altitudePadding : null
        body.fill = type === 'altitude' ? fillAltitude : null
        body.border = type === 'altitude' ? !underBorder : null
        body.show_route = type === 'route'
        body.show_altitude = type === 'altitude'
        dbInteractions.createRecordNonEditable('exports_pro', import.meta.env.VITE_JWT_TOKEN, body).then(res => {
            console.log('created export pro:', res)
            updateVisits('has_exported', true)
        }).catch(e => {
            console.error('error creating the export pro:', e)
        })
    }

    const computeGpxInfo = (t, w, h, r, p, ti, ub) => {
        const routeInformation = utils.getRoutePath(
            utils.normalizeCoordinates(t.coordinates, w, h, r, ti),
            w,
            h,
            ti
        );

        const altitudeInformation = utils.getAltitudePath(
            utils.normalizeAltitude(t.altitudeStream, w, h, r, ti),
            h,
            p,
            t.altitudeStream,
            ti,
            ub
        );

        return {
            routeInformation,
            altitudeInformation
        };
    };

    const normalizeGpxInfo = useCallback((t, w, h) => {
        let altitudeStream = t.altitudeStream
        let coordinates = t.coordinates
        let timingStreamSeconds = t.timingStreamSeconds
        let name = t.name

        const data = computeGpxInfo(
            t,
            w,
            h,
            resolution,
            altitudePadding,
            thickness,
            underBorder
        );

        setWidthSvg(type === 'altitude' ? w : data.routeInformation.widthRoute);

        setHeightSvg(
            type === 'altitude'
            ? data.altitudeInformation.heightAltitude
            : data.routeInformation.heightRoute
        );

        setGpxInfo({
            altitudeStream: altitudeStream,
            coordinates: coordinates,
            timingStreamSeconds: timingStreamSeconds,
            name: name,
            routePath: data.routeInformation.pathData,
            routeWidth: data.routeInformation.widthRoute,
            routeHeight: data.routeInformation.heightRoute,
            altitudePath: data.altitudeInformation.pathData,
            altitudeWidth: w,
            altitudeHeight: data.altitudeInformation.heightAltitude
        });

    }, [resolution, altitudePadding, thickness, underBorder, type]);

    // const normalizeGpxInfo = useCallback((t,w,h,r,p,ti,ub) => {
    //     console.log('normalizeGpxInfo, resolution:', resolution)
    //     if(!t && gpxInfo) t = gpxInfo
    //     if(!w) w = getWidth()
    //     if(!h) h = getHeight()
    //     if(!r) r = resolution
    //     if(!p) p = altitudePadding
    //     if(!ti) ti = thickness
    //     let routeInformation = utils.getRoutePath(utils.normalizeCoordinates(t.coordinates, w, h, r, ti), w, h, ti)
    //     let altitudeInformation = utils.getAltitudePath(utils.normalizeAltitude(t.altitudeStream, w, h, r, ti), h, p, t.altitudeStream, ti, ub)
    //     setWidthSvg(type === 'altitude' ? w : routeInformation.widthRoute)
    //     setHeightSvg(type === 'altitude' ? altitudeInformation.heightAltitude : routeInformation.heightRoute)
    //     console.log('gpxInfo:', t)
    //     console.log('type:', type)
    //     setGpxInfo(() => ({
    //         routePath: routeInformation.pathData,
    //         routeWidth: routeInformation.widthRoute,
    //         routeHeight: routeInformation.heightRoute,
    //         altitudePath: altitudeInformation.pathData,
    //         altitudeWidth: w,
    //         altitudeHeight: altitudeInformation.heightAltitude
    //     }))
    // },[
    //     gpxInfo,
    //     altitudePadding,
    //     resolution,
    //     thickness,
    //     type
    // ])

    const processGPX = (event) => {
        console.log('processGPX, event:', event)
        updateVisits('has_loaded_gpx', true)
        setIsLoading(true)
        if(event && event.target && event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            const reader = new FileReader();
            let tempGpxInfo = {}
            reader.onload = (e) => {
                let gpxFile = e.target.result
                const parser = new XMLParser({  
                    ignoreAttributes: false,
                    attributeNamePrefix: ""
                })
                const json = parser.parse(gpxFile);
                const gpx = json.gpx
                const trk = gpx.trk ? gpx.trk : undefined
                const trkpt = trk && trk.trkseg && trk.trkseg.trkpt ? trk.trkseg.trkpt : undefined
                let elevationStream = trkpt && trkpt.length ? [...trkpt.map(point => (point.ele))] : undefined
                let coordinatesStream = trkpt && trkpt.length ? [...trkpt.map(point => ([Number(point.lon), Number(point.lat)]))] : undefined
                let durationData =  u.computeDuration(trkpt)
                tempGpxInfo = {
                    altitudeStream: elevationStream,
                    coordinates: coordinatesStream,
                    timingStreamSeconds: durationData,
                    name: trk.name ? he.decode(trk.name) : undefined,
                }
                setGpxInfo(tempGpxInfo)
                normalizeGpxInfo(tempGpxInfo, width, height, resolution, altitudePadding, thickness, underBorder)
            }

            reader.readAsText(file);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!visitId) createVisitPro()
        if (!gpxInfo) return;
        // else setLoadedGPX(true)

        const handleResize = () => {
            const tempW = getWidth();
            const tempH = getHeight();

            setWidth(tempW);
            setHeight(tempH);

            normalizeGpxInfo(
                gpxInfo,
                tempW,
                tempH,
                resolution,
                altitudePadding,
                thickness,
                underBorder
            );
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [visitId, gpxInfo, resolution, altitudePadding, thickness, underBorder, normalizeGpxInfo]);

    // useEffect(() => {
    //     if(!visitId) createVisitPro()
    //     if(!gpxInfo) return
    //     const handleResize = () => {
    //         const tempW = getWidth()
    //         const tempH = getHeight()
    //         setWidth(tempW)
    //         setHeight(tempH)
    //         normalizeGpxInfo(gpxInfo, tempW, tempH, resolution, altitudePadding, thickness, underBorder)
    //     }
    //     window.addEventListener("resize", handleResize)
    //     setLoadedGPX(true)
    //     return () => {
    //         window.removeEventListener("resize", handleResize)
    //     }
    // },[
    //     gpxInfo,
    //     resolution,
    //     visitId,
    //     altitudePadding,
    //     normalizeGpxInfo,        
    //     thickness,
    //     underBorder
    // ])

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
        // setLoadedGPX(false)
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
                    <div className="buttons-subrow">
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
                    </div>
                    {type === 'altitude' && <div className="buttons-subrow buttons-subrow-margin-top">
                        <div className="wrapper-controller margin-left-600">
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
                        </div>
                        <div className="wrapper-controller margin-left">
                            <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_FILL}</p>
                            <div className="buttons-wrapper-resolution button-controller button-action" onClick={changeFillAltitude}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">{String(fillAltitude)}</p>
                            </div>
                        </div>
                        <div className="wrapper-controller margin-left">
                            <p className="p-dimention-xs p-color p-uppercase">{vocabulary[language].TEXT_UNDER_BORDER}</p>
                            <div className="buttons-wrapper-resolution button-controller button-action" onClick={changeUnderBorder}>
                                <p className="p-color-secondary p-uppercase p-dimention p-centering">{String(underBorder)}</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            {type === 'route' && <div style={{height: height, width: width}} className="svg-container">
                <svg ref={svgRef} width={widthSvg} height={heightSvg} viewBox={`0 0 ${widthSvg} ${heightSvg}`} xmlns="http://www.w3.org/2000/svg">
                    <path d={gpxInfo.routePath} style={styleRoute}/>
                </svg>
            </div>}
            {type === 'altitude' && <div style={{height: height, width: width}} className="svg-container">
                <svg ref={svgRef} width={widthSvg} height={heightSvg} viewBox={`0 0 ${widthSvg} ${heightSvg}`} xmlns="http://www.w3.org/2000/svg">
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
            {!gpxInfo && buttons()}
            {gpxInfo && svgCreator()}
        </div>}
    </div>)
}

export default Pro