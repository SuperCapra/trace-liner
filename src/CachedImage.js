import React from 'react';

function CachedImage(props) {
    return (<img id="cached-image" src={props.photoUrl} style={{display: 'none'}} alt="Cached" />);
}

export default CachedImage;