import '../App.css';
import './Dropdown.css';
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react';
import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
import {ReactComponent as Tick} from '../assets/images/tick.svg'
import brandingPalette from '../config/brandingPalette';
import { vocabulary } from '../config/vocabulary';

const Dropdown = forwardRef((props,ref) => {
    const {value, values, type, text, hasBorder, size, possibilityDeselect, inactive, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [valueSelected, setValueSelected] = useState(value);
    const [rightSize, setRightSize] = useState('300px');
    const [inactivePrivate, setInactivePrivate] = useState(inactive || !values || (values && !values.length)  ? true : false);

    const getClasses = 'dropdown-selected-value' + (inactivePrivate ? '' : ' dropdown-selected-value-active')

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
        console.log('inactivePrivate:',inactivePrivate)
        console.log('inactive:',inactive)
        console.log('value:',values)
        const element = dropdownRef.current.querySelector("#dropdownValues")
        if(element && !inactive) {
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

    const getClassesDropdown = 'p-dimention p-left p-color p-uppercase dimention-dropdown' + (hasBorder === 'true' ? ' border-dropdown' : '')

    const resizeElement = () => {
        console.log('type', type)
        console.log('size', size)
        let widthScreen = window.innerWidth;
        let defaultWidth = widthScreen < 600 ? '300px' : '200px';
        let widthElement = size ? size : defaultWidth;
        console.log('widthElement', widthElement)
        // if(size === '100px' && widthScreen < 600 && widthScreen >= 500) {
        //     widthElement = '143px'
        // } else 
        if(widthScreen < 600) {
            if(size && size === '100px') {
                widthElement = (widthScreen - 32)/2 + 'px';
            } else {
                widthElement = (widthScreen - 20) + 'px';
            }
        }

        setRightSize(widthElement);
    }

    const returnStyleDropdown = () => {
        return {
            width: rightSize,
            filter: inactivePrivate ? 'brightness(0.6)' : 'none'
        }
    }
    const returnStyleTextDropdown = () => {
        return {
            width: hasBorder ? (rightSize ? (Number(rightSize.replace('px','')) < 200 ? (Number(rightSize.replace('px','')) * 0.9) + 'px' : rightSize) : '300px') : 'unset',
        }
    }
    const styleText = returnStyleTextDropdown()
    const styleDropdown = returnStyleDropdown()

    const resetSelect = () => {
        setValueSelected(undefined)
    }

    const setInactive = (inactiveValue) => {
        setInactivePrivate(inactiveValue);
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
        setInactive
    }));

    useEffect(() => {
        resizeElement()
        window.addEventListener("resize", resizeElement)
        return () => window.removeEventListener("resize", resizeElement)
    })

    return(
        // <div className="p-dimention p-left p-color p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} onBlur={closeDropdown} tabIndex={0} ref={dropdownRef}>
            <div className={getClasses} onClick={hideShowDropDown}>
                {valueSelected && <p style={styleText}>{valueSelected}</p>}
                {!valueSelected && text && <p style={styleText}>{text}</p>}
                {!valueSelected && !text && <p style={styleText}>{vocabulary.en.DROPDOWN_SELECT}</p>}
                <ArrowDown className="scale-arrow" style={styleArrowDown20}/>
            </div>
            <div id="dropdownValues" style={styleDropdown} className="dropdown-appear dropdown-values no-see-dropdown-values">
                {returnValues()}
            </div>
        </div>
    )
})

export default Dropdown;