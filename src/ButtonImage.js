import './App.css';
import React from 'react';
import {ReactComponent as ShareSVG} from './share.svg'
import brandingPalette from './brandingPalette';

class ButtonImage extends React.Component{
    render() {
        const shareStyle = {
            fill: brandingPalette.pink
        }
        return(
            <div style={shareStyle}>
                <ShareSVG />
            </div>
        )
    }
}

export default ButtonImage;