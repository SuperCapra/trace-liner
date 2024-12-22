import '../App.css';
import React from 'react';
import {ReactComponent as Mode1SVG} from '../assets/images/mode1.svg'
import {ReactComponent as Mode2SVG} from '../assets/images/mode2.svg'
import {ReactComponent as Mode3SVG} from '../assets/images/mode3.svg'
import {ReactComponent as Mode4SVG} from '../assets/images/mode4.svg'
import {ReactComponent as Mode5SVG} from '../assets/images/mode5.svg'

function Selector(props) {
    const {vocabulary, handleSelectMode} = props

    return (<div className="wrapper-list-selector">
        <div className="row-selector">
            <div className="padding-mode-selector">
                <div className="wrapper-mode-selector" onClick={() => handleSelectMode('mode1')}>
                    <p className="p-back">MODE 1</p>
                    <div className="position-mode">
                        <Mode1SVG className="scale-mode" />
                    </div>
                </div>
            </div>
            <div className="padding-mode-selector">
                <div className="wrapper-mode-selector" onClick={() => handleSelectMode('mode2')}>
                    <p className="p-back">MODE 2</p>
                    <div className="position-mode">
                        <Mode2SVG className="scale-mode" />
                    </div>
                </div>
            </div>
        </div>
        <div className="row-selector">
            <div className="padding-mode-selector">
                <div className="wrapper-mode-selector" onClick={() => handleSelectMode('mode3')}>
                    <p className="p-back">MODE 3</p>
                    <div className="position-mode">
                        <Mode3SVG className="scale-mode" />
                    </div>
                </div>
            </div>
            <div className="padding-mode-selector">
                <div className="wrapper-mode-selector" onClick={() => handleSelectMode('mode4')}>
                    <p className="p-back">MODE 4</p>
                    <div className="position-mode">
                        <Mode4SVG className="scale-mode" />
                    </div>
                </div>
            </div>
        </div>
        <div className="row-selector">
            <div className="padding-mode-selector">
                <div className="wrapper-mode-selector" onClick={() => handleSelectMode('mode5')}>
                    <p className="p-back">MODE 5</p>
                    <div className="position-mode">
                        <Mode5SVG className="scale-mode" />
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Selector