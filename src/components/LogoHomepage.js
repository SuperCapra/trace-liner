import '../App.css';
import React from 'react';
import {ReactComponent as LogoExtendedCircleSVG} from '../assets/images/logoExtendedCircle.svg'
import './LogoHomepage.css'

function LogoHomepage(props) {
    return(
        <LogoExtendedCircleSVG className="width-title-logo"></LogoExtendedCircleSVG>
    )
}

export default LogoHomepage;