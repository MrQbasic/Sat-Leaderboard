
import "./Header.css"

import userImg from "./user.png"
import logoutImg from "./logout.svg"

function Header ({displayNav, setDisplayNav, loggedIn, username, setDisplayLoginWindow, displayLoginWindow}){
    return(
        <div className="Header">
            <div className={"navToggle noselect"} onClick={()=>{console.log("asd"); setDisplayNav(!displayNav)}}> 
                <div className={displayNav ? ("down"):("left")}>{"<"}</div>
            </div>
            <h1>Sat Leaderboard</h1>
            {loggedIn ? (
                <>
                <button className={displayLoginWindow ? ("UserSettings selected"):("UserSettings")} onClick={()=>{localStorage.setItem("clientToken", ""); window.location.reload()}}>
                    <h2>{username}</h2>
                    <img src={logoutImg}></img>
                </button>
                </>
            ):(
                <button className={displayLoginWindow ? ("LoginButton selected"):("LoginButton")} onClick={()=>setDisplayLoginWindow(!displayLoginWindow)}>
                    <h2>Login</h2>
                </button>
            )}
        </div>
    );
}


export default Header