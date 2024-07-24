import {executeQuery} from "../sql.js"
import { dbPath } from "./FileUpload.js";
import { execSync } from "child_process"

function routeRemove(app){
    console.log("Leaderboard: new route: /api/remove")
    app.post("/api/remove", async(req, res)=>{
        //checkToken and get userID
        const clientToken = req.body.clientToken;
        const users = await executeQuery("SELECT userID FROM Users WHERE clientToken=(?)", [clientToken])
        if(users.length > 1){
            console.warn("Leaderboard: Multiple Users with same clientID!")
            res.status(500)
            return
        }else if(users.length === 0){
            res.json({status: "ERROR-TOKEN"})
            return
        }
        //remove from db
        executeQuery("DELETE FROM SatData WHERE dataID=(?)", [req.body.dataID])
        //remove folder
        execSync("rm -rf "+dbPath+req.body.dataID)
        res.json("OK")
    })
}

export default routeRemove