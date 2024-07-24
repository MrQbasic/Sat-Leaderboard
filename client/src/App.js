import './App.css';

import {useEffect, useState} from "react";

import Header from './modules/Header/Header.js';
import Nav from './modules/Nav/Nav.js';
import Login from './modules/Login/Login.js';
import MyData from './modules/MyData/MyData.js';
import Leaderboard from './modules/Leaderboard/Leaderboard.js';
import About from './modules/About/About.js';

import axios from "axios"

function App() {
  
  
  const [ displayNav, setDisplayNav ] = useState(true);

  const [displayLoginWindow, setDisplayLoginWindow] = useState(true);

  const [username, setUsername] = useState(undefined);
  const [clientToken, setClientToken] = useState(undefined);

  var mainWindow = localStorage.getItem("windowPosition")
  if(mainWindow === undefined || mainWindow === null) mainWindow = 0;

  //check for autoLogin
  useEffect(() => {
    //check if there is a clientToken saved
    const clientToken = localStorage.getItem("clientToken")
    if(clientToken === "" || clientToken == null) return;
    console.log("Tying autologin with: ",clientToken);
    //check if token is valid and get username
    axios.post("http://leons-ideen.de:3001/api/login", {clientToken: clientToken}).then((res) => {
      if(res.data.status === "SUCCESS"){
        setClientToken(res.data.clientToken);
        setUsername(res.data.username);
      }else{
        localStorage.setItem("clientToken", "")
      }
    })
  }, [setClientToken, setUsername])


  var loggedIn = (username === undefined) ? (false) : (true);


  return (
    <div className="App">
      <Header loggedIn={loggedIn} displayNav={displayNav} setDisplayNav={setDisplayNav} username={username} displayLoginWindow={displayLoginWindow} setDisplayLoginWindow={setDisplayLoginWindow}/>


      { displayLoginWindow && !loggedIn? (<Login setUsername={setUsername} setClientToken={setClientToken}/>):(<></>)}

      <div className="Main">
        { displayNav ? (<Nav navPos={mainWindow}/>):(<></>)}
        { mainWindow==0 ? (<Leaderboard/>):(<></>)}
        { loggedIn && mainWindow==1 ? (<MyData/>):(<></>)}
        { mainWindow==2 ? (<About/>):(<></>)}
      </div>

    </div>
  );
}

export default App;
