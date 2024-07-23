import { useEffect, useState } from "react"

import "./Leaderboard.css"
import axios from "axios";

function updateLeaderboard(setLeaderboardData){
    axios.post("http://leons-ideen.de:3001/api/leaderboard", {}).then((res)=>{
        setLeaderboardData(res.data)
    })
}

const listCategories = [["Username", "username"], ["Satellite","sat"],["Date of Data", "date"],["Size", "length"],["Antenna", "antenna"], ["Band", "band"]]

function Leaderboard(){
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(()=>{
        updateLeaderboard(setLeaderboardData);
    },[])

    return(<div className="Leaderboard">
        <div className="body">
            <div className="List">
                {listCategories.map((col, index)=>(
                    <div className="ListCol">
                        <h4>{col[0]}</h4>
                        {leaderboardData.map((data, index)=>(
                            <p>
                                {data[col[1]]!==null ? (data[col[1]]):("-")}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>)
}

export default Leaderboard