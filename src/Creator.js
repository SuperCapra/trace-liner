import './App.css';
import React from 'react';
import { vocabulary } from './vocabulary.js';

function Creator(props) {
    const {language, classes} = props
    return (
        <div className={classes}>
            <div>
                {vocabulary[language].NAME_APP}
            </div>
            <div>
                {vocabulary[language].CREATED_BY}
            </div>
        </div>
    )
}

export default Creator