import { use } from 'react';
import '../App.css';
import './TextCheckbox.css';
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react';
// import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
// import {ReactComponent as Tick} from '../assets/images/tick.svg'
// import brandingPalette from '../config/brandingPalette';
// import { vocabulary } from '../config/vocabulary';

const TextCheckbox = forwardRef((props,ref) => {
    const {value, values, type, hasBorder, size, inactive, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [rightSize, setRightSize] = useState('300px');
    const [valueSelected, setValueSelected] = useState(value)

    const returnValueSelected = () => {
        if(!valueSelected) setValueSelected(value)
        return <p style={styleText}>{valueSelected}</p>
    }

    const changeValue = () => {
        if(inactive) return
        let valueSetting
        if(valueSelected === values[0]) valueSetting = values[1]
        else valueSetting = values[0]

        if(valueSetting === valueSelected) return
        setValueSelected(valueSetting)
        handleChangeValue({type: type, value: valueSetting})
        // closeDropdown()
    }

    const getClassesDropdown = 'p-dimention p-left p-color p-uppercase dimention-textcheckbox textcheckbox-value' + (hasBorder === 'true' ? ' border-dropdown' : '')
    const styleText = {
        width: hasBorder ? (size ? size : '200px') : 'unset'
    } 
    const returnStyleDropdown = () => {
        return {
            width: rightSize,
            filter: inactive ? 'brightness(0.6)' : 'none'
        }
    }

    const styleDropdown = returnStyleDropdown()

    const resetSelect = () => {
        setValueSelected(values[0])
    }

    const resizeElement = () => {
        console.log('type', type)
        console.log('size', size)
        let widthScreen = window.innerWidth;
        let defaultWidth = widthScreen < 600 ? '300px' : '200px';
        let widthElement = size ? size : defaultWidth;
        console.log('widthElement', widthElement)
        if(size === '100px' && widthScreen < 600 && widthScreen >= 300) {
            widthElement = '145px'
        } else if(widthScreen < 300) {
            if(size && size === '100px') {
                widthElement = ((widthScreen * 0.91) - 20)/2 + 'px';
            } else {
                widthElement = widthScreen * 0.91 + 'px';
            }
        }

        setRightSize(widthElement);
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
    }));

    useEffect(() => {
        if(size) resizeElement()
        window.addEventListener("resize", resizeElement)
    }, [
        size
    ])

    return(
        // <div className="p-dimention p-left p-color p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} tabIndex={0} ref={dropdownRef}>
            <div className="dropdown-selected-value" onClick={() => changeValue()}>
                {returnValueSelected()}
            </div>
        </div>
    )
})

export default TextCheckbox;