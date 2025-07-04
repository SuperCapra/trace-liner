import '../App.css';
import React, {useState, forwardRef} from 'react';
import {ReactComponent as Close} from '../assets/images/close.svg'
import brandingPalette from '../config/brandingPalette';
// import Loader from './Loader.js'
import utils from '../utils/utils.js'
import logUtils from '../utils/logUtils.js'

const Modal = forwardRef((props,ref) => {

    const {message, title, language, showButtons, handleCloseModal} = props

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const styleClose = {
      fill: brandingPalette.background
    }

    return(
        <div className="modal-overlay" onClick={(e) => {if(e.target.className === 'modal-overlay') handleCloseModal()}}>
          <div className="modal-dimention-positioning" id="modal" tabIndex={0}>
            {/* {isLoading && <div className="modal-text"><Loader color='background'/></div>} */}
            {/* {!isLoading && isError && <div>
                <div className="modal-close-wrapper">
                    <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                </div>
                <div className="modal-text">
                    <p className="p-color-modal p-dimention p-left p-color">{message}</p>
                </div>
            </div>} */}
            {!isLoading && !isError && <div className="display-flex-vertical">
                <div>
                  <div className="modal-close-wrapper">
                      <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                  </div>
                </div>
                <div className="modal-text modal-text-dimention-general">
                    <p className="p-color-modal p-dimention p-left p-color">{message}</p>
                </div>
                {/* {!showButtons && <div className="modal-buttons">
                  <ButtonCompleteSVG className="modal-buttons-single-wrapper" onClick={() => share('jpeg')}></ButtonCompleteSVG>
                  <ButtonCountourSVG className="modal-buttons-single-wrapper" onClick={() => share('png')}></ButtonCountourSVG>}
                </div>} */}
            </div>}
          </div>
        </div>
    )
})

export default Modal;