import './App.css';
import React, {useState} from 'react';
import {ReactComponent as ArrowDown} from './images/arrowDownSimplified20.svg'
import {ReactComponent as Tick} from './images/tick.svg'
import brandingPalette from './brandingPalette';

function Dropdown(props) {

    const {value, values, handleChangeValue} = props

    const [valueSelected, setValueSelected] = useState(value)

    const returnValues = () => {
        let resultHTML = []
        for(let v of values) {
            let classesForvalue = v === valueSelected ? "dropdown-value" : "dropdown-value dropdown-unselected-value"
            let classeForTick = v === valueSelected ? "see-selected-language padding-5" : "no-see-selected-language padding-5"
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
        const element = document.getElementById("dropdownValues")
        if(element) {
            if(element.classList.contains("no-see-dropdown-values")) {
                element.classList.replace("no-see-dropdown-values", "see-dropdown-values")
            } else {
                element.classList.replace("see-dropdown-values", "no-see-dropdown-values")
            }
        }
    }

    const changeValue = (valueSetting) => {
        if(valueSetting === valueSelected) return
        setValueSelected(valueSetting)
        handleChangeValue({type: 'language', value: valueSetting})
        // value = valueSetting
    }

    return(
        <div className="p-back p-uppercase">
            <div className="dropdown-selected-value" onClick={hideShowDropDown}>
                <p>{valueSelected}</p>
                <ArrowDown className="padding-5" style={styleArrowDown20}/>
            </div>
            <div id="dropdownValues" className="dropdown-values no-see-dropdown-values">
                {returnValues()}
            </div>
        </div>
    )
}

export default Dropdown;