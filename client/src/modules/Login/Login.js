import "./Login.css"

import axios from "axios";
import {sha512} from "js-sha512";
import { useState, useTransition } from "react";

const numberToBase64 = (x) => 
    (x > 64 ? numberToBase64(Math.floor(x/64)) : '') 
        + "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"[x % 64];

function requestLogin(password, username){
    console.log("new login")
    //check inputs
    if(username === "" || username === undefined || password === "" || password === undefined){
        return "ERROR";
    }
    //encrypt psw
    const pswHash = sha512(password);

    //try doing request
    try {
       return axios.post("http://leons-ideen.de:3001/api/login", {username: username, password: pswHash})
    } catch (e) {
        console.error(e);
    }
}

function Login({setUsername, setClientToken}){
    var password, username;

    return(
        <div className="Login">
            <p>THIS IS ONLY HTTP!<br/>PSW TRASMISSION NOT ENCRYPTED!<br/>USE A PSW YOU DONT MIND!</p>
            <input maxLength={"32"}  type="text"     placeholder={"Username"} onChange={ (event) => {username = event.target.value} }/>
            <input maxLength={"256"} type="password" placeholder={"Password"} onChange={ (event) => {password = event.target.value} }/>
            <button type="submit" className="Submit" onClick={()=>{
                requestLogin(password, username).then((res)=>{
                    console.log(res.data);
                    localStorage.setItem("clientToken", res.data.clientToken);
                    setClientToken(res.data.clientToken);
                    setUsername(res.data.username);
                });
                }}>Login / Register</button>
        </div>
    )
}


export default Login;