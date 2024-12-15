import '../App.css';
import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {ReactComponent as Close} from '../assets/images/close.svg'
import brandingPalette from '../config/brandingPalette';
import { vocabulary/**, languages*/ } from '../config/vocabulary.js';
import Loader from './Loader.js'
import utils from '../utils/utils.js'
import logUtils from '../utils/logUtils.js'
import saleforceApiUtils from '../services/salesforce.js'
import apiUtils from '../utils/apiUtils.js';
import dbInteractions from '../services/dbInteractions.js';

const Modal = forwardRef((props,ref) => {

    const {/**message, title,*/ activity, infoLog, club, admin, language, activityId, userId, visitId, showButtons, handleCloseModal} = props

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
      if(type === 'png') infoLog.exportType = 'contour'
      try {
        if(navigator.share && utils.isMobile(club, admin)) {
          try {
            console.info('Is user activation: ', navigator.userActivation.isActive)
            // captureAndUploadImage(canvas, titleImage, 'jpeg', blob)
            const file = new File([b], titleImage , {type: typeFile, lastModified: new Date()});
            navigator.share({
              title: title,
              text: 'Trace liner image sharing',
              files: [file]
            }).catch(error => {
              if(String(error).includes('NotAllowedError')) downloadImage(title, b, type)
              console.error('Error sharing image:', error)
              insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,JSON.stringify(error),JSON.stringify(infoLog),'modal','navigator.share','exception')})
            });
          } catch (error) {
            console.error('Error sharing image:', error)
          }
        } else {
          downloadImage(title, b, type)
        }
      } catch (e) {
        console.error('Error:', e)
        insertLogsModal({body: apiUtils.getErrorLogsBody(visitId,e,JSON.stringify(infoLog),'modal','share','exception')})
      } finally {
        try {
          logUtils.loggerText('infoLog: ', infoLog)
          // logUtils.loggerText('infoLog body:', saleforceApiUtils.getBodyLog(infoLog))
          saleforceApiUtils.storeLog(process.env,infoLog)
          insertExport({body: apiUtils.getExportBody(infoLog,activityId,userId)})
        } catch (e) {
          console.error('Error:', e)
        }
        handleCloseModal()
      }
    }
    const downloadImage = (title, blob, type) => {
      try {
        logUtils.loggerText('title:', title)
        logUtils.loggerText('blob:', blob)
        logUtils.loggerText('type:', type)
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
    
    const insertExport = async (data) => {
      dbInteractions.createRecordNonEditable('exports', process.env.REACT_APP_JWT_TOKEN, data.body).then(res => {
        updateVisitModal({export_id: res, has_exported: true, type_export: data.body.type})
      }).catch(e => {
        console.error('error creating the activity:', e)
      })
    }

    const updateVisitModal = async (body) => {
      dbInteractions.updateRecordNonEditable('visits', process.env.REACT_APP_JWT_TOKEN, visitId, body)
    }
    const insertLogsModal = async (data) => {
      let body = data.body
      dbInteractions.createRecordNonEditable('logs', process.env.REACT_APP_JWT_TOKEN, body)
    }

    useImperativeHandle(ref, () => ({
      loaded
    }))

    return(
        <div className="modal-overlay" onClick={(e) => {if(e.target.className === 'modal-overlay') handleCloseModal()}}>
          <div className="modal-dimention-positioning" id="modal" tabIndex={0}>
            {isLoading && <div className="modal-text"><Loader color='background'/></div>}
            {!isLoading && isError && <div>
                <div className="modal-close-wrapper">
                    <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                </div>
                <div className="modal-text">
                    <p className="modal-p p-back">{vocabulary[language]['MODAL_ERROR']}</p>
                </div>
            </div>}
            {!isLoading && !isError && <div>
                <div>
                  <div className="modal-close-wrapper">
                      <Close className="modal-close-icon" style={styleClose} onClick={() => handleCloseModal()}/>
                  </div>
                </div>
                <div className="modal-text">
                    <p className="modal-p p-back">{vocabulary[language]['MODAL_TEXT']}</p>
                </div>
                {!showButtons && <div className="modal-buttons">
                    <div className="modal-buttons-single modal-buttons-p" onClick={() => share('jpeg')}>{vocabulary[language]['MODAL_COMPLETE']}</div>
                    <div className="modal-buttons-single modal-buttons-p" onClick={() => share('png')}>{vocabulary[language]['MODAL_CONTOUR']}</div>
                </div>}
            </div>}
          </div>
        </div>
    )
})

export default Modal;