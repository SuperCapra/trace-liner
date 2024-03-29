import './App.css';
import React from 'react';
import {ReactComponent as ShareSVG} from './share.svg'
import {ReactComponent as ModifySVG} from './modify.svg'
import brandingPalette from './brandingPalette';

class ButtonImage extends React.Component{
    render() {
        const shareStyle = {
            fill: brandingPalette.pink,
            margin: '1vw'
        }
        const modifyStyle = {
            fill: brandingPalette.pink,
            margin: '1vw'
        }
        return(
            <div className="wrapper-buttons">
                <div style={modifyStyle} onClick={() => this.props.clickModify()}>
                    <ModifySVG />
                </div>
                <div style={shareStyle} onClick={() => this.props.clickShare()}>
                    <ShareSVG />
                </div>
            </div>
        )
    }
}

export default ButtonImage;