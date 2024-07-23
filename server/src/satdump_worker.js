import { dbPath } from "./actions/FileUpload.js";
import { executeQuery } from "./sql.js";

import { exec, execSync } from "child_process"
import fs, { access } from "fs";
import sizeOf from "image-size";
import { stdin } from "process";

function timestampToString(timestamp) {
    if (timestamp < 0) timestamp = 0;
    const date = new Date(timestamp * 1000);
    
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const formattedDate = 
        year + "/" + 
        (month > 9 ? month : "0" + month) + "/" +
        (day > 9 ? day : "0" + day) + " " +
        (hours > 9 ? hours : "0" + hours) + ":" +
        (minutes > 9 ? minutes : "0" + minutes) + ":" +
        (seconds > 9 ? seconds : "0" + seconds);
    
    return formattedDate;
}

var running = false;

async function decode(){
    if(running) return;
    running = true;
    //check db for new tasks
    const tasks = await executeQuery("SELECT * FROM SatData WHERE status=0");
    console.log(tasks);
    //work on em all
    tasks.forEach(async(task, index) => {
        //change Status
        await executeQuery("UPDATE SatData SET status=1 WHERE dataID=(?)", [task.dataID])
        //decode
        const folder= dbPath+task.dataID;
        var band;
        var dataType;
        switch(task.satType){
            case "meteor_hrpt":
                band = "L";
                dataType = "cadu"
                break;
            case "noaa_hrpt":
                band = "L";
                dataType = "frames";
                break;
            case "metop_ahrpt":
                band = "L";
                dataType = "cadu";
                break;
        }
        execSync('satdump '+task.satType+" "+dataType+" "+folder+"/data.* "+folder, {encoding: 'utf-8'});
        //read generated stuff from satdump
        const dataset = JSON.parse(fs.readFileSync(folder+"/dataset.json"));
        var sat = dataset.satellite;
        var date = timestampToString(dataset.timestamp);
        //check size
        var size
        switch(task.satType){
            case "noaa_hrpt":
            case "metop_ahrpt":
                const dim = await sizeOf(folder+"/AVHRR/AVHRR-1.png")
                console.log(dim)
                size = dim.height;
                break;
            case "meteor_hrpt":
                size = await sizeOf(folder+"/MSU-MR/MSU-MR-1.png").height
                console.log(size)
                break;
            default:
                size = 0;
        }
        executeQuery("UPDATE SatData SET length=(?) WHERE dataID=(?)", [size, task.dataID])
        //write back to database
        executeQuery("UPDATE SatData SET sat=(?), status=2, date=(?), band=(?) WHERE dataID=(?)", [sat, date, band, task.dataID])  
    })
    //reset
    setTimeout(()=>{running=false}, 1000);
}

setInterval(decode, 5000)
