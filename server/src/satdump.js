
import { Worker } from "worker_threads";


function installSatdump(){
    const worker = new Worker("/home/web/web/Sat-Leaderboard/server/src/satdump_worker.js")
}   

export default installSatdump