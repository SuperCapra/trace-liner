import '../App.css';
import './Pro.css';
import React, {useState} from 'react';
import {ReactComponent as ButtonGpxSVG} from '../assets/images/buttonGpx.svg'
import { vocabulary } from '../config/vocabularyPro';

function Pro(props) {
    const {language} = props
    const [loadedGPX, setLoadedGPX] = useState(false)

    const buttons = () => {
        console.log('language', language)
        return(<div>
                <div className="wrapper-title-logo margin-title-logo">
                    <p className="p-color p-dimention-xl p-uppercase">{vocabulary[language].TITLE_BUTTON}</p>
                </div>
                <div className="wrapper-button-login" /**onClick={() => this.loadGPX()}*/>
                    <ButtonGpxSVG className="homepage-button"></ButtonGpxSVG>
                    <input id="gpxInput" type="file" accept=".gpx" style={{display: 'none'}} /**onChange={this.processGPX}*/ />
                </div>
            </div>)
    }
    const svgCreator = () => {
        return(<div>
ECCOLO
            </div>)
    }

    return (<div>
        {!loadedGPX && buttons()}
        {loadedGPX && svgCreator()}
    </div>)
}

export default Pro