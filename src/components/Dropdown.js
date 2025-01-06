import '../App.css';
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
import {ReactComponent as Tick} from '../assets/images/tick.svg'
import brandingPalette from '../config/brandingPalette';
import { vocabulary } from '../config/vocabulary';

const Dropdown = forwardRef((props,ref) => {
    const {value, values, type, text, hasBorder, size, possibilityDeselect, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [valueSelected, setValueSelected] = useState(value)

    const returnValues = () => {
        let resultHTML = []
        for(let v of values) {
            let classesForvalue = v === valueSelected ? "dropdown-value" : "dropdown-value dropdown-unselected-value"
            let classeForTick = v === valueSelected ? "see-selected padding-5" : "no-see-selected padding-5"
            let styleTick = {
                fill: brandingPalette.background
            }
            resultHTML.push(<div className={classesForvalue} key={v} onClick={() => changeValue(v)}><div key={v} className="display-flex-dropdown-value padding-5"><p>{v}</p><Tick className={classeForTick} style={styleTick}/></div></div>)
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
        console.log('valueSelected:',valueSelected)
        console.log('text:',text)
        if(!possibilityDeselect && valueSetting === valueSelected) return
        setValueSelected(valueSetting)
        handleChangeValue({type: type, value: valueSetting})
        closeDropdown()
    }

    const getClassesDropdown = 'p-back p-uppercase' + (hasBorder === 'true' ? ' border-dropdown' : '')
    const styleText = {
        width: hasBorder ? (size ? size : '200px') : 'unset'
    } 
    const styleDropdown = {
        width: size ? size : '200px'
    }

    const resetSelect = () => {
        setValueSelected(undefined)
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
    }));

    return(
        // <div className="p-back p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} onBlur={closeDropdown} tabIndex={0} ref={dropdownRef}>
            <div className="dropdown-selected-value" onClick={hideShowDropDown}>
                {valueSelected && <p style={styleText}>{valueSelected}</p>}
                {!valueSelected && text && <p style={styleText}>{text}</p>}
                {!valueSelected && !text && <p style={styleText}>{vocabulary.en.DROPDOWN_SELECT}</p>}
                <ArrowDown className="padding-5" style={styleArrowDown20}/>
            </div>
            <div id="dropdownValues" style={styleDropdown} className="dropdown-appear dropdown-values no-see-dropdown-values">
                {returnValues()}
            </div>
        </div>
    )
})

export default Dropdown;