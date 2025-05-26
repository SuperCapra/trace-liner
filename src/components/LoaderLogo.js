import '../App.css';
import React from 'react';
import {ReactComponent as LogoRotatingSVG} from '../assets/images/logoRotating.svg'
import './LoaderLogo.css'

function LoaderLogo(props) {

    const {position} = props

    const classes = position === 'homepage' ? 'logo-animation-homepage-loader logo-width-homepage-loader' : 'logo-animation-loader logo-width-loader'

    return(
        <LogoRotatingSVG className={classes}></LogoRotatingSVG>
    )
}

export default LoaderLogo;