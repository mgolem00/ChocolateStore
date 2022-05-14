import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Register = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    function onChangeUsername(e) {
        setUsername(e.target.value);
    }
    
    function onChangePassword(e) {
        setPassword(e.target.value);
    }

    function onChangePassword2(e) {
        setPassword2(e.target.value);
    }
    
    function handleLogin(e) {
        e.preventDefault();
    
        if (password !== password2) {
            console.log("Passwords do not match");
        }
        else {
            fetch("http://localhost:4000/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: {"Content-type": "application/json;charset=UTF-8"}
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                    console.log("User Registered!");
                    navigate('/login'); 
            })
            .catch((err)=>console.log(err));
        }
        
    }

    return(
        <div className="login">
        <div className="loginBox">
            <b>Register to ČokoCraft</b><br/>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                value={username}
                onChange={onChangeUsername}
                onBlur={onChangeUsername}
            ></input>

            <label htmlFor="password">Password</label>
            <input
                type="password"
                value={password}
                onChange={onChangePassword}
                onBlur={onChangePassword}
            ></input>

            <label htmlFor="repeat password">Repeat Password</label>
            <input
                type="password"
                value={password2}
                onChange={onChangePassword2}
                onBlur={onChangePassword2}
            ></input>
            <button onClick={(e) => {handleLogin(e);}}>Register</button>

            <p>Ipak ne želite? Idite u <Link to='/'><i className="material-icons">store</i></Link>!</p>
        </div>
        </div>
    )
};
export default Register;