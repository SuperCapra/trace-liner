import '../App.css';
import React, {useState} from 'react';
import './Login.css'
import brandingPalette from '../config/brandingPalette.js';
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'

function Login(props) {

    const [valueUsername, setValueUsername] = useState(null);
    const [valuePassword, setValuePassword] = useState(null);
    const [typePassword, setTypePassword] = useState(null);
    const [hide, setHide] = useState(true);

    const onChangePassword = (event) => {
        setValuePassword(event.target.value)
    }

    const onChangeUsername = (event) => {
        let value = event.target.value
        console.log(value)
        setValueUsername(value)
    }

    const onChangeHide = () => {
        if(hide) setTypePassword('text')
        else setTypePassword('password')
        setHide(!hide)
    }
    const eyeStyle = {
        fill: brandingPalette.primary,
        width: '25px',
        height: '25px'
    }

    return (<div className="wrapper-login modal-overlay">
            <p className="p-dimention-xl p-color">PLEASE LOGIN</p>
            <input type="text" value={valueUsername} className="input-login p-dimention p-left p-color input-margin" placeholder="Username" onChange={onChangeUsername}/>
            <div className="wrapper-password input-login input-margin position-relative">
                <input type={typePassword} value={valuePassword} className="input-login-password p-dimention p-left p-color padding-right" placeholder="Password" onChange={onChangePassword}/>
                {hide && <HideSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></HideSVG>}
                {!hide && <ViewSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></ViewSVG>}
            </div>
    </div>)
}

export default Login