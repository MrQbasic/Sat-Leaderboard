import "./Nav.css"



function Nav({navPos}){
    return(
        <div class="Nav">
            <div className={navPos==0?("selected"):("")} onClick={()=>{localStorage.setItem("windowPosition", 0);window.location.reload()}}>Leaderboard</div>
            <div className={navPos==1?("selected"):("")} onClick={()=>{localStorage.setItem("windowPosition", 1);window.location.reload()}}>My Uploads</div>
        </div>
    )
}

export default Nav