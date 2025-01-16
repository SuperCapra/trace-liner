import '../App.css';
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
// import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
// import {ReactComponent as Tick} from '../assets/images/tick.svg'
// import brandingPalette from '../config/brandingPalette';
// import { vocabulary } from '../config/vocabulary';

const TextCheckbox = forwardRef((props,ref) => {
    const {value, values, type, hasBorder, size, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [valueSelected, setValueSelected] = useState(value)

    const returnValueSelected = () => {
        if(!valueSelected) setValueSelected(value)
        return <p style={styleText}>{valueSelected}</p>
    }

    const changeValue = () => {
        let valueSetting
        if(valueSelected === values[0]) valueSetting = values[1]
        else valueSetting = values[0]

        if(valueSetting === valueSelected) return
        setValueSelected(valueSetting)
        handleChangeValue({type: type, value: valueSetting})
        // closeDropdown()
    }

    const getClassesDropdown = 'p-back p-uppercase' + (hasBorder === 'true' ? ' border-dropdown' : '')
    const styleText = {
        width: hasBorder ? (size ? size : '200px') : 'unset'
    } 
    const styleDropdown = {
        width: size ? size : '200px'
    }

    const resetSelect = () => {
        setValueSelected(values[0])
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
    }));

    return(
        // <div className="p-back p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} tabIndex={0} ref={dropdownRef}>
            <div className="dropdown-selected-value" onClick={() => changeValue()}>
                {returnValueSelected()}
            </div>
        </div>
    )
})

export default TextCheckbox;