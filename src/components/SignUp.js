import '../App.css';
import React, {useState} from 'react';
import './Login.css'
import brandingPalette from '../config/brandingPalette.js';
import {ReactComponent as ViewSVG} from '../assets/images/view.svg'
import {ReactComponent as HideSVG} from '../assets/images/hide.svg'

function SignUp(props) {

    const [valueUsername, setValueUsername] = useState(null);
    const [valuePassword, setValuePassword] = useState(null);
    const [typePassword, setTypePassword] = useState("password");
    const [hide, setHide] = useState(true);
    const [submittable, setSubmittable] = useState(false);

    const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    const messageUsername = `You need to enter an username in the form of an email`
    const messagePassword = `Required 8 characters, 1 number, one Upper character and a special character such ad .*[!@#$%^&*()_+-=[]{};':"\\|,.<>/?]`

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
    const onBlur = (event) => {
        console.log('event.target.name', event.target.name)
        checkValidity()
    }
    const checkValidity = () => {
        let legitUsername = usernameRegex.test(valueUsername)
        let legitPassword = passwordRegex.test(valuePassword)
        console.log('password validity', passwordRegex.test(valuePassword))
        console.log('username validity', usernameRegex.test(valueUsername))
        const usernameElement = document.getElementById("username")
        const passwordElement = document.getElementById("password")
        if(legitUsername && usernameElement.classList.contains("input-error-validity"))  usernameElement.classList.remove("input-error-validity")
        if(legitPassword && passwordElement.classList.contains("input-error-validity"))  passwordElement.classList.remove("input-error-validity")
        if(legitPassword && legitUsername) {
            setSubmittable(true)
        } else {
            setSubmittable(false)
            if(usernameElement && !legitUsername && !usernameElement.classList.contains("input-error-validity")) {
                usernameElement.classList.add("input-error-validity")
            }
            if(passwordElement && !legitPassword && !passwordElement.classList.contains("input-error-validity")) {
                passwordElement.classList.add("input-error-validity")
            }
        }
    }
    const onSubmit = () => {

    }

    return (<div className="wrapper-login modal-overlay">
            <p className="p-dimention-xl p-color">SIGN UP</p>
            <input 
                className="input-login p-dimention p-left p-color input-margin" 
                id="username"
                type="text" 
                name="username"
                value={valueUsername} 
                pattern={usernameRegex} 
                onBlur={onBlur}
                title="You need to enter an username in the form of an email" 
                placeholder="Username" onChange={onChangeUsername}/>
            <div className="wrapper-password input-login input-margin position-relative" id="password">
                <input 
                    className="input-login-password p-dimention p-left p-color padding-right" 
                    type={typePassword} 
                    name="password"
                    value={valuePassword} 
                    pattern={passwordRegex} 
                    onBlur={onBlur}
                    title={messagePassword}
                    placeholder="Password" onChange={onChangePassword}/>
                {hide && <HideSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></HideSVG>}
                {!hide && <ViewSVG className="position-hide" onClick={onChangeHide} style={eyeStyle}></ViewSVG>}
            </div>
            {submittable && <div className="button-create-user active-button" id="submit" onClick={onSubmit}>
                <p className="p-dimention">CREATE USER</p>
            </div>}
            {!submittable &&  <div className="button-create-user disabled-button" id="submit" onClick={onSubmit}>
                <p className="p-dimention">CREATE USER</p>
            </div>}

    </div>)
}

export default SignUp