import '../App.css';
import React from 'react';
import {ReactComponent as LogoRotatingSVG} from '../assets/images/logoRotating.svg'
import './LoaderLogo.css'

function LoaderLogo(props) {

    const {position} = props

    const classes = position === 'homepage' ? 'logo-animation-homepage logo-width-homepage' : 'logo-animation logo-width'

    return(
        <LogoRotatingSVG className={classes}></LogoRotatingSVG>
    )
}

export default LoaderLogo;