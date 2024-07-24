import { dbPath } from "./actions/FileUpload.js";
import { executeQuery } from "./sql.js";

import { execSync } from "child_process"
import fs, { access } from "fs";
import sizeOf from "image-size";

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var running = false;

async function decode(){
    if(running) return;
    running = true;
    //check db for new tasks
    const tasks = await executeQuery("SELECT * FROM SatData WHERE status=0");
    console.log(tasks);
    //work on em all
    for(var i=0; i<tasks.length; i++){
        const task = tasks[i];
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
            case "meteor_m2-x_lrpt":
                band = "VHF";
                dataType = "cadu";
                break;
            case "noaa_hrpt":
                band = "L";
                dataType = "frames";
                break;
            case "noaa_apt":
                band = "VHF";
                dataType = "audio_wav";
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
        var dim
        switch(task.satType){
            case "noaa_apt":
                dim = await sizeOf(folder+"/raw.png")
                console.log(dim)
                size = dim.height;
                break 
            case "noaa_hrpt":
            case "metop_ahrpt":
                dim = await sizeOf(folder+"/AVHRR/AVHRR-1.png")
                console.log(dim)
                size = dim.height;
                break;
            case "meteor_hrpt":
            case "meteor_m2-x_lrpt":
                dim = await sizeOf(folder+"/MSU-MR/MSU-MR-1.png")
                console.log(dim)
                size = dim.height;
                break;
            default:
                size = 0;
        }
        await executeQuery("UPDATE SatData SET length=(?) WHERE dataID=(?)", [size, task.dataID])
        //write back to database
        await executeQuery("UPDATE SatData SET sat=(?), status=2, date=(?), band=(?) WHERE dataID=(?)", [sat, date, band, task.dataID])
        console.log("TAF")
        sleep(1000);
    }
    //reset
    setTimeout(()=>{running=false}, 1000);
}

setInterval(decode, 5000)
