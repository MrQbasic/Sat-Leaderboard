import "./Nav.css"


function Nav({navPos}){
    return(
        <div class="Nav">
            <div className={navPos===0?("selected"):("")} onClick={()=>{localStorage.setItem("windowPosition", 0);window.location.reload()}}>Leaderboard</div>
            <div className={navPos===1?("selected"):("")} onClick={()=>{localStorage.setItem("windowPosition", 1);window.location.reload()}}>My Uploads</div>
            <div className={navPos===2?("selected"):("")} onClick={()=>{localStorage.setItem("windowPosition", 2);window.location.reload()}}>About</div>
        </div>
    )
}

export default Nav