import { executeQuery } from "../sql.js"

import fileUpload from "express-fileupload"

import {access, mkdir} from "fs/promises"

const dbPath = "/home/web/web/Sat-Leaderboard/db/"



function routeFileUpload(app){
    console.log("Leaderboard: New Route: /api/upload")

    app.post("/api/upload", async(req, res) => {
        try {
            //check if there where actually files uploaded
            if(!req.files || Object.keys(req.files).length === 0){
                res.json({status: "ERROR"});
            }
            //checkToken and get userID
            const clientToken = req.body.clientToken;
            const users = await executeQuery("SELECT userID FROM Users WHERE clientToken=(?)", [clientToken])
            if(users.length > 1){
                console.warn("Leaderboard: Multiple Users with same clientID!")
                res.status(500)
                return;
            }else if(users.length === 0){
                res.json({status: "ERROR-TOKEN"})
                return
            }
            const userID = users[0].userID
            //save all the files
            var length = req.files.file.length
            var files = req.files.file
            if(length === undefined){
                length = 1
                files = [files]
            };

            for(var i=0; i<length; i++){
                //create new entry in inventory Database
                const asw = await executeQuery("INSERT INTO SatData (userID, status, satType) VALUES ((?),0,(?))", [userID,req.body.sat]);
                const dataID = asw.insertId;
                //get file extension and check it
                const fileName = files[i].name.split('.').pop();
                //TODO filename Check
                //create dir if it doesn't exist
                const path = dbPath+dataID
                await mkdir(path).catch(()=>undefined);
                //save to disk
                files[i].mv(path+"/data."+fileName, (e)=>{ if(e) throw Error("Couldn't save File")})
                //decode with satdump


            }
            //if everything went well the send Ok back
            res.json({status: "SUCCESS"});
        }catch (e) {
            console.error("Leaderboard: ", e);
            res.status(500);
        }
    });
}

export {routeFileUpload, dbPath}