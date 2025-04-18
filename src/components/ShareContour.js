import React from 'react';
import brandingPalette from '../config/brandingPalette';
function ShareContour(props) {
    let styleContour = {
        fill:'none',
        stroke:brandingPalette.primary,
        strokeWidth:4.04727,
        strokeLinecap:'round',
        strokeLinejoin:'round',
        strokeMiterlimit:33.2,
        strokeDasharray:'none',
        strokeOpacity:1,
        paintOrder:'markers fill stroke'
    }
    return(<svg className="feature" width="45px" height="45px">
        <path style={styleContour} d="m 4.9111716,40.994406 c 3.3384058,1.149158 9.9333064,-2.136386 15.1444784,-1.601632 5.211171,0.534754 9.037764,4.888011 13.433727,3.614234 4.395964,-1.273777 9.362395,-8.17328 9.729596,-12.362216 C 43.586174,26.455856 39.352494,24.97739 38.944582,21.938056 38.53667,18.898723 41.95618,14.299054 39.351557,10.069114 36.746934,5.8391742 28.11674,1.9787371 21.765244,2.3070285 15.413749,2.63532 11.342903,7.1528521 11.139978,11.794408 c -0.202926,4.641556 3.460836,9.405499 2.483731,12.238491 -0.977105,2.832991 -6.5948739,3.736497 -9.363617,6.981767 -2.7687431,3.245269 -2.6873262,8.830581 0.6510796,9.97974 z"/>
      </svg>)
}
export default ShareContour