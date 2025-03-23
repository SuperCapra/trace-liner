import '../App.css';
import React from 'react';
import {ReactComponent as LogoSVG} from '../assets/images/logo.svg'
import './LoaderLogo.css'

function LoaderLogo(props) {
    return(
        <LogoSVG width="10%" className="logo-animations"></LogoSVG>
    )
}

export default LoaderLogo;