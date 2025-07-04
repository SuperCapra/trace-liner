import '../App.css';
import './MultiDropdown.css';
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react';
import {ReactComponent as ArrowDown} from '../assets/images/arrowDownSimplified20.svg'
import {ReactComponent as Tick} from '../assets/images/tick.svg'
import brandingPalette from '../config/brandingPalette';
import { vocabulary } from '../config/vocabulary';

const MultiDropdown = forwardRef((props,ref) => {
    const {valuesSelected, valuesAvailable, type, hasBorder, size, inactive, handleChangeValue} = props
    
    const dropdownRef = useRef(null);
    const [textSelected, setTextSelected] = useState('(' + (valuesSelected && valuesSelected.length ? valuesSelected.length : '0') + ')');
    const [rightSize, setRightSize] = useState('300px');
    const [inactivePrivate, setInactivePrivate] = useState(inactive || !valuesAvailable || (valuesAvailable && !valuesAvailable.valuesAvailable)  ? true : false);

    const getClasses = 'multidropdown-selected-value' + (inactivePrivate ? '' : ' multidropdown-selected-value-active')

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
        handleChangeValue({type: type, valuesSelected: valuesSelected})
    }

    const getClassesDropdown = 'p-dimention p-left p-color p-uppercase dimention-multidropdown' + (hasBorder === 'true' ? ' border-dropdown' : '')
    const returnStyleTextDropdown = () => {
        return {
            width: hasBorder ? (rightSize ? (Number(rightSize.replace('px','')) < 200 ? (Number(rightSize.replace('px','')) * 0.95) + 'px' : rightSize) : '300px') : 'unset',
        }
    }
    const styleText = returnStyleTextDropdown()

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
                widthElement = (widthScreen - 42)/2 + 'px';
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

    const styleDropdown = returnStyleDropdown()

    const resetSelect = () => {
        setTextSelected('(0)')
    }
    const selectAll = () => {
        setTextSelected('(' + valuesAvailable.length + ')')
    }
    const setInactive = (inactiveValue) => {
        setInactivePrivate(inactiveValue)
    }

    useImperativeHandle(ref, () => ({
        resetSelect,
        selectAll,
        setInactive
    }));

    useEffect(() => {
        if(size) resizeElement()
        window.addEventListener("resize", resizeElement)
        return () => window.removeEventListener("resize", resizeElement)
    })

    return(
        // <div className="p-dimention p-left p-color p-uppercase" id="dropDown">
        <div className={getClassesDropdown} id="dropDown" style={styleDropdown} onBlur={closeDropdown} tabIndex={0} ref={dropdownRef}>
            <div className={getClasses} onClick={hideShowDropDown}>
                {textSelected && <p style={styleText}>{textSelected}</p>}
                {!textSelected && <p style={styleText}>{vocabulary.en.DROPDOWN_SELECT}</p>}
                <ArrowDown className="scale-arrow" style={styleArrowDown20}/>
            </div>
            <div id="dropdownValues" style={styleDropdown} className="dropdown-appear dropdown-values no-see-dropdown-values">
                {returnValues()}
            </div>
        </div>
    )
})

export default MultiDropdown;