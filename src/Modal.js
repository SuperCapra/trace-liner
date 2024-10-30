import './App.css';
import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {ReactComponent as Close} from './images/close.svg'
import brandingPalette from './brandingPalette';
import Loader from './Loader.js'
import utils from './utils.js'
import saleforceApiUtils from './api/salesforce.js'
import { vocabulary/**, languages*/ } from './vocabulary.js';

const Modal = forwardRef((props,ref) => {

    const {message, title, activity, infoLog, club, admin, language, showButtons, handleCloseModal} = props

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [blobComplete, setBlobComplete] = useState(null)
    const [blobCountour, setblobCountour] = useState(null)

    const styleClose = {
        fill: brandingPalette.background
    }
    const loaded = (blobComp,blobCont) => {
        if(!blobComp && !blobCont) setIsError(true)
        setIsLoading(false)
        setBlobComplete(blobComp)
        setblobCountour(blobCont)
    }
    const share = (type) => {
        type = type.toLowerCase()
        let title = utils.getTitle(activity.beautyName)
        let titleImage = utils.getTitleExtension(title, type)
        let typeFile = 'image/' + type
        let b = type === 'png' ? blobCountour : blobComplete
        try {
          if(navigator.share && utils.isMobile(club, admin)) {
            try {
              console.log('navigator.UserActivation.isActive hey:', navigator.userActivation.isActive)
              // captureAndUploadImage(canvas, titleImage, 'jpeg', blob)
              const file = new File([b], titleImage , {type: typeFile, lastModified: new Date()});
              navigator.share({
                title: title,
                text: 'Trace liner image sharing',
                files: [file]
              }).catch(error => {
                if(String(error).includes('NotAllowedError')) downloadImage(title, b, type)
                console.error('Error sharing image:', error)
              });
            } catch (error) {
              console.error('Error sharing image:', error)
            }
          } else {
            downloadImage(title, b, type)
          }
        } catch (e) {
          console.log('Error:', e)
        } finally {
          try {
            console.log('infoLog: ', infoLog)
            // console.log('infoLog body:', saleforceApiUtils.getBodyLog(infoLog))
            saleforceApiUtils.storeLog(process.env,infoLog)
          } catch (e) {
            console.log('Error:', e)
          }
          handleCloseModal()
        }
      }
      const downloadImage = (title, blob, type) => {
        try {
          console.log('title:', title)
          console.log('blob:', blob)
          console.log('type:', type)
          const url = URL.createObjectURL(blob);
          const temp = document.createElement('a');
          temp.href = url;
          temp.download = title + '.' + type;
          temp.click();
          URL.revokeObjectURL(url); // Clean up URL object after use
        } catch (error) {
          console.error('Error downloading image:', error);
        } finally {
            handleCloseModal()
        }
      }

    useImperativeHandle(ref, () => ({
        loaded
    }))

    return(
        // <div className="p-back p-uppercase" id="dropDown">
        <div className="modal-dimention-positioning" id="modal" tabIndex={0}>
            {isLoading && <div className="modal-text"><Loader/></div>}
            {!isLoading && isError && <div>
                <div className="modal-close-wrapper">
                    <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                </div>
                <div className="modal-text">
                    <p className="modal-p p-back">{vocabulary[language]['MODAL_ERROR']}</p>
                </div>
            </div>}
            {!isLoading && !isError && <div>
                <div className="modal-close-wrapper">
                    <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                </div>
                <div className="modal-text">
                    <p className="modal-p p-back">{vocabulary[language]['MODAL_TEXT']}</p>
                </div>
                {!showButtons && <div className="modal-buttons">
                    <div className="modal-buttons-single modal-buttons-p" onClick={() => share('jpeg')}>{vocabulary[language]['MODAL_COMPLETE']}</div>
                    <div className="modal-buttons-single modal-buttons-p" onClick={() => share('png')}>{vocabulary[language]['MODAL_CONTOUR']}</div>
                </div>}
            </div>}

            {/* <div className="p-back p-uppercase" id="dropDown" onBlur={closeDropdown} tabIndex={0}> */}
        </div>
    )
})

export default Modal;