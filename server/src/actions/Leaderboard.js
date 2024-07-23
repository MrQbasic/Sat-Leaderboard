import { executeQuery } from "../sql.js";

function routeLeaderboard(app){
    console.log("Leaderboard: New Route: /api/leaderboard")
    app.post("/api/leaderboard", async(req, res)=>{
        const data = await executeQuery("SELECT Users.username, SatData.length, SatData.sat, SatData.dishSize, SatData.band, SatData.antenna, SatData.date, SatData.length FROM Users, SatData WHERE SatData.userID=Users.userID AND SatData.status=2 ORDER BY SatData.length DESC")
        console.log(data)
        res.json(data);
    })
}

export default routeLeaderboard;