import '../App.css';
import React, {useState} from 'react';
import './Login.css'
import brandingPalette from '../config/brandingPalette.js';
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'
import dbInteractions from '../services/dbInteractions.js';

function SignUp(props) {

    const [valueUsername, setValueUsername] = useState(null);
    const [valuePassword, setValuePassword] = useState(null);
    const [typePassword, setTypePassword] = useState("password");
    const [hide, setHide] = useState(true);
    const [submittable, setSubmittable] = useState(false);
    const [legitUsername, setLegitUsername] = useState(true);
    const [legitPassword, setLegitPassword] = useState(true);
    const [showMessageUsername, setShowMessageUsername] = useState(false);
    const [showMessagePassword, setShowMessagePassword] = useState(false);
    const [leftshift, setLeftshift] = useState('unset');
    const [messageError,setMessageError] = useState('Key (username)=(gmaggi@traceliner.com) already exists.');
    const [hasError, setHasError] = useState(true);

    const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    const messageUsername = `You need to enter an username in the form of an email`
    const messagePassword = `Required 8 characters, 1 number, one Upper character and a special character such ad .*[!@#$%^&*()_+-=[]{};':"\\|,.<>/?]`

    const onChangePassword = (event) => {
        setValuePassword(event.target.value)
        resetValues()
    }

    const onChangeUsername = (event) => {
        let value = event.target.value
        console.log(value)
        setValueUsername(value)
        resetValues()
    }

    const resetValues = () => {
        hasError(false)
        setSubmittable(false)
    }

    const styleMessage = {
        left: leftshift,
        textAlign: 'left',
        width: '20vw'
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
    const onBlur = (event) => {
        console.log('event.target.name', event.target.name)
        console.log('event.target.value', event.target.value)
        checkValidity(event.target.name, event.target.value)
    }
    const checkValidity = (name, value) => {
        setHasError(false)
        if(name === 'password') {
            let legitPasswordLocal = !value.length || (value.length && passwordRegex.test(value))
            setLegitPassword(legitPasswordLocal)
            const passwordElement = document.getElementById("password")
            console.log('legitPasswordLocal', legitPasswordLocal)
            if(legitPasswordLocal && passwordElement.classList.contains("input-error-validity")) {
                passwordElement.classList.remove("input-error-validity")
                setShowMessagePassword(false)
            }
            if(legitUsername && legitPasswordLocal) setSubmittable(true)
            else {
                setSubmittable(false)
                if(passwordElement && !legitPasswordLocal && !passwordElement.classList.contains("input-error-validity"))
                passwordElement.classList.add("input-error-validity")
            }
        }
        if(name === 'username') {
            let legitUsernameLocal = !value.length || (value.length && usernameRegex.test(value))
            setLegitUsername(legitUsernameLocal)
            const usernameElement = document.getElementById("username")
            console.log('legitUsernameLocal', legitUsernameLocal)
            if(legitUsernameLocal && usernameElement.classList.contains("input-error-validity")) {
                usernameElement.classList.remove("input-error-validity")
                setShowMessageUsername(false)
            }
            if(legitPassword && legitUsernameLocal) setSubmittable(true)
            else {
                setSubmittable(false)
                if(usernameElement && !legitUsernameLocal && !usernameElement.classList.contains("input-error-validity"))
                usernameElement.classList.add("input-error-validity")
            }
        }
    }
    const onSubmit = () => {
        console.log('onsubmit')
        dbInteractions.register({username: valueUsername, password: valuePassword}, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res', res)
        }).catch(e => {
            setHasError(true)
            setMessageError(e && e.error && e.error.detail ? e.error.detail : 'error')
            console.error('error creating the user:', e)
        })
    }
    const changeShowUsername = () => {
        setShowMessageUsername(true)
        setShowMessagePassword(false)
        setStyleMessage()
    }
    const changeShowPassword = () => {
        setShowMessagePassword(true)
        setShowMessageUsername(false)
        setStyleMessage()
    }

    const setStyleMessage = () => {
        const elementInput = document.getElementById('username')
        if(elementInput) {
            console.log('width', elementInput.offsetWidth)
            let rightWidth = elementInput.offsetWidth + 20
            setLeftshift(`${rightWidth}px`)
        }
    }

    return (<div className="wrapper-login modal-overlay">
            <p className="p-dimention-xl p-color">SIGN UP</p>
            <div className="wrapper-element-input position-relative">
                <input 
                    className="input-login p-dimention p-left p-color input-margin" 
                    id="username"
                    type="text" 
                    name="username"
                    value={valueUsername}  
                    onBlur={onBlur}
                    title="You need to enter an username in the form of an email" 
                    placeholder="Username" onChange={onChangeUsername}/>
                {!legitUsername && <p className="p-dimention p-color-tertiary position-info" onClick={changeShowUsername}>i</p>}
                {showMessageUsername && <div className="position-info-message" style={styleMessage}>
                        <div className="position-info-message border-popover">
                            <p className="p-dimention-xs p-color-tertiary">{messageUsername}</p>
                            <div className="border-popover-triangle"></div>
                        </div>
                    </div>}
            </div>
            <div className="wrapper-element-input position-relative">
                <div className="wrapper-element-input input-login input-margin position-relative" id="password">
                    <input 
                        className="input-login-password p-dimention p-left p-color padding-right" 
                        type={typePassword} 
                        name="password"
                        value={valuePassword} 
                        onBlur={onBlur}
                        placeholder="Password" onChange={onChangePassword}/>
                    {hide && <HideSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></HideSVG>}
                    {!hide && <ViewSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></ViewSVG>}
                </div>
                {!legitPassword && <p className="p-dimention p-color-tertiary position-info" onClick={changeShowPassword}>i</p>}
                {showMessagePassword && <div className="position-info-message" style={styleMessage}>
                        <div className="position-info-message border-popover">
                            <p className="p-dimention-xs p-color-tertiary">{messagePassword}</p>
                            <div className="border-popover-triangle"></div>
                        </div>
                    </div>}
            </div>
            {submittable && <div className="button-create-user active-button position-relative" id="submit" onClick={onSubmit}>
                <p className="p-dimention">CREATE USER</p>
                {hasError && <div className="position-info-message-username" style={styleMessage}>
                        <div className="position-info-message-username border-popover">
                            <p className="p-dimention-xs p-color-tertiary">{messageError}</p>
                            <div className="border-popover-triangle"></div>
                        </div>
                    </div>}
            </div>}
            {!submittable &&  <div className="button-create-user disabled-button" id="submit" onClick={onSubmit}>
                <p className="p-dimention">CREATE USER</p>
            </div>}

    </div>)
}

export default SignUp