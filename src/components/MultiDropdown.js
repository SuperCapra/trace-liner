import '../App.css';
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
import {ReactComponent as Tick} from '../assets/images/tick.svg'
import brandingPalette from '../config/brandingPalette';
import { vocabulary } from '../config/vocabulary';

const MultiDropdown = forwardRef((props,ref) => {
    const {valuesSelected, valuesAvailable, type, hasBorder, size, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [textSelected, setTextSelected] = useState('(' + (valuesSelected && valuesSelected.length ? valuesSelected.length : '0') + ')');
    // const [valueSelectedPrivate, setValueSelectedPrivate] = useState(valuesSelected);

    const returnValues = () => {
        let resultHTML = []
        if(valuesAvailable && valuesAvailable.length) {
            for(let v of valuesAvailable) {
                let index = valuesSelected.findIndex(x => x === v)
                let classesForvalue =  index === -1 ? "dropdown-value" : "dropdown-value dropdown-unselected-value"
                let classeForTick = index !== -1 ? "see-selected padding-5" : "no-see-selected padding-5"
                let styleTick = {
                    fill: brandingPalette.background
                }
                resultHTML.push(<div className={classesForvalue} key={v} onClick={() => changeValue(v)}><div key={v} className="display-flex-dropdown-value padding-5"><p>{v}</p><Tick className={classeForTick} style={styleTick}/></div></div>)
            }
        }
        return resultHTML
    }

    const styleArrowDown20 = {
        fill: brandingPalette.primary
    }

    const hideShowDropDown = () => {
        const element = dropdownRef.current.querySelector("#dropdownValues")
        if(element) {
            if(element.classList.contains("no-see-dropdown-values")) {
                element.classList.replace("no-see-dropdown-values", "see-dropdown-values")
            } else {
                element.classList.replace("see-dropdown-values", "no-see-dropdown-values")
            }
        }
    }

    const closeDropdown = () => {
        const element = dropdownRef.current.querySelector("#dropdownValues")
        if(element) {
            if(element.classList.contains("see-dropdown-values")) {
                element.classList.replace("see-dropdown-values", "no-see-dropdown-values")
            }
        }
    }

    const changeValue = (valueSetting) => {
        let index = valuesSelected.findIndex(x => x === valueSetting)
        if(index === -1) {
            let correctIndex = valuesAvailable.findIndex(x => x === valueSetting);
            valuesSelected.splice(correctIndex, 0, valueSetting);
        } else {
            valuesSelected.splice(index,1)
        }
        setTextSelected('('+ valuesSelected.length +')')
        // setValueSelectedPrivate(valuesSelected)
        // if(valueSetting === valueSelected) return
        // setValueSelected(valueSetting)
        handleChangeValue({type: type, valuesSelected: valuesSelected})
    }

    const getClassesDropdown = 'p-back p-uppercase' + (hasBorder === 'true' ? ' border-dropdown' : '')
    const styleText = {
        width: hasBorder ? (size ? size : '200px') : 'unset'
    } 
    const styleDropdown = {
        width: size ? size : '200px'
    }
    const resetSelect = () => {
        setTextSelected('(0)')
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
    }));

    return(
        // <div className="p-back p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} onBlur={closeDropdown} tabIndex={0} ref={dropdownRef}>
            <div className="dropdown-selected-value" onClick={hideShowDropDown}>
                {textSelected && <p style={styleText}>{textSelected}</p>}
                {!textSelected && <p style={styleText}>{vocabulary.en.DROPDOWN_SELECT}</p>}
                <ArrowDown className="padding-5" style={styleArrowDown20}/>
            </div>
            <div id="dropdownValues" style={styleDropdown} className="dropdown-appear dropdown-values no-see-dropdown-values">
                {returnValues()}
            </div>
        </div>
    )
})

export default MultiDropdown;