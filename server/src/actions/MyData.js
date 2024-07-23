import { executeQuery } from "../sql.js"

function routeMyData(app){
    console.log("Leaderboard: New Route: /api/login")
    app.post("/api/myData", async(req, res)=>{
        const clientToken = req.body.clientToken;
        //get user from ClientToken
        const hits = await executeQuery("SELECT userID FROM Users WHERE clientToken=(?)", [clientToken]);
        if(hits.length > 1){
            console.warn("Leaderboard: Multiple Users with same clientToken!")
            res.status(500);
            return;
        }else if(hits.length == 0){
            res.json({status: "ERROR-TOKEN"});
            return;
        }
        const userID = hits[0].userID;
        //get all data entries from user
        const data = await executeQuery("SELECT * FROM SatData WHERE userID=(?)", [userID]);
        res.json(data)
    })
}

export default routeMyData