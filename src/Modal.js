import './App.css';
import React from 'react';
import {ReactComponent as Close} from './images/close.svg'
import brandingPalette from './brandingPalette';

function Modal(props) {

    const {message, title, showButtons, handleCloseModal} = props

    const styleClose = {
        fill: brandingPalette.background
    }

    return(
        // <div className="p-back p-uppercase" id="dropDown">
        <div className="modal-dimention-positioning" id="modal" tabIndex={0}>
            <div className="modal-close-wrapper" >
                <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
            </div>
            <div className="modal-text">
                <p className="modal-p p-back">CIAO!</p>
            </div>
            {!showButtons && <div className="modal-buttons">
                <div className="modal-buttons-single modal-buttons-p" onClick={() => handleCloseModal()}>BACK</div>
                <div className="modal-buttons-single modal-buttons-ahead modal-buttons-p">AVANTI</div>
            </div>}

            {/* <div className="p-back p-uppercase" id="dropDown" onBlur={closeDropdown} tabIndex={0}> */}
        </div>
    )
}

export default Modal;