import React from 'react';
import brandingPalette from '../config/brandingPalette';
function SelectedImage(props) {
    let styleRect = {
        fill: brandingPalette.secondary,
        strokeWidth: 7.55906,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 33.2,
        paintOrder: 'markers fill stroke',
    }
    let styleSelected = {
        fill: brandingPalette.background,
        strokeWidth: 2.23654,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 0.5,
    }
    return(<svg className="position-0" width="50px" height="50px" style={props.style} viewBox="0 0 50 50">
            <path style={styleRect} d="M 19.15625 0 L 50 30.845703 L 50 5 C 50 2.2300028 47.769997 0 45 0 L 19.15625 0 z "/>
            <path style={styleSelected} d="m 46.553535,3.7917837 c -0.378161,0 -0.755681,0.1442471 -1.045452,0.4340115 L 38.194041,11.539838 35.181889,8.5290589 c -0.579504,-0.579508 -1.512753,-0.5795079 -2.092259,10e-8 -0.579507,0.5795073 -0.579507,1.512755 0,2.092263 l 3.837861,3.836498 c 0.02306,0.02307 0.04682,0.04433 0.07096,0.06555 0.04264,0.05709 0.08867,0.111842 0.140579,0.16378 0.579531,0.579528 1.51273,0.579528 2.092259,-5e-6 l 8.369067,-8.3690521 c 0.579524,-0.5795284 0.579524,-1.512734 0,-2.0922627 C 47.310596,3.9360398 46.931701,3.791793 46.553549,3.791793 Z"/>
        </svg>)
}
export default SelectedImage