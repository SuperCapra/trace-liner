import './App.css';
import React, { useEffect } from 'react';
import brandingPalette from './brandingPalette';

function Loader(props) {
    const {color} = props
    useEffect(() => {
        if(brandingPalette[color]) document.documentElement.style.setProperty('--dot-typing-color', brandingPalette[color])
        else document.documentElement.style.setProperty('--dot-typing-color', brandingPalette.primary)
      }, [color]);
    return(
        <div className="dot-typing"></div>
    )
}

export default Loader;