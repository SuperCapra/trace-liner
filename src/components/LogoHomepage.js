import '../App.css';
import React from 'react';
import {ReactComponent as LogoExtendedCircleSVG} from '../assets/images/logoExtendedCircle.svg'
import './LoaderLogo.css'

function LogoHomepage(props) {
    return(
        <LogoExtendedCircleSVG className="logo-width-homepage"></LogoExtendedCircleSVG>
    )
}

export default LogoHomepage;