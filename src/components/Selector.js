import '../App.css';
import React from 'react';

function Selector(props) {
    const {vocabulary, handleSelectMode} = props

    return (<div>
        <p onClick={() => handleSelectMode('mode1')}>MODE 1</p>
        <p onClick={() => handleSelectMode('mode2')}>MODE 2</p>
        <p onClick={() => handleSelectMode('mode3')}>MODE 3</p>
        <p onClick={() => handleSelectMode('mode4')}>MODE 4</p>
        <p onClick={() => handleSelectMode('mode5')}>MODE 5</p>
    </div>)
}

export default Selector