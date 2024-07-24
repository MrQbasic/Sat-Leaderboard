import axios from "axios";
import "./MyData.css"

import { useEffect, useState } from "react";

import removeIcon from "./remove.png";

function updateMyData(setMySatData){
    const clientToken = localStorage.getItem("clientToken")
    if(clientToken === undefined || clientToken === "") return;
    //get the data
    axios.post("http://leons-ideen.de:3001/api/myData", {clientToken: clientToken}).then((res) => {
        setMySatData(res.data)
    })
}

function uploadFile(file, sat, setProgress){
    //get clientToken
    const clientToken = localStorage.getItem("clientToken");
    if(clientToken === undefined || clientToken === "") return;
    //add all files to request
    const data = new FormData() ;
    data.append('file', file[0]);
    data.append('sat', sat);
    data.append('clientToken', clientToken);
    //send Request
    axios.post("http://leons-ideen.de:3001/api/upload", data, {
        onUploadProgress: (event)=>{
            const precent = Math.round((event.loaded * 100) / event.total);
            setProgress(precent)
        }
    }).then(res => { 
        console.log(res.data)
        window.location.reload()
    })
}

function removeData(dataID, callBack){
    //get clientToken
    const clientToken = localStorage.getItem("clientToken");
    if(clientToken === undefined || clientToken === "") return;
    //send request
    axios.post("http://leons-ideen.de:3001/api/remove", {dataID: dataID, clientToken: clientToken}).then(callBack);
}

const listCategories = [["Satellite","sat"],["Date of Data", "date"],["Size", "length"],["Antenna", "antenna"], ["Band", "band"], ["Status", "status"]]
const statusMap = ["Uploaded", "In Work", "Done"]

function MyData(){
    const [mySatData, setMySatData] = useState([]);
    
    const [upSat, setUpSat] = useState("");
    const [upFile, setUpFile] = useState(undefined);

    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(()=>{
        updateMyData(setMySatData)
    }, []);

    return(
    <div className="MyData">
        <h1>My Uploads</h1>
        <div className="body"> 
            <div className="Uploads">
                <table>
                    <tr>
                        {listCategories.map((category, index)=>(
                            <th>{category[0]}</th>
                        ))}
                    </tr>
                    {mySatData.map((data, index)=>(
                        <tr>
                            {listCategories.map((category, index)=>(
                                <td>
                                    { category[0] === "Status" ? (
                                        <div className="status">
                                            {statusMap[data[category[1]]]}
                                            {data[category[1]]===2 ? (
                                                <div className="options">
                                                    <img className="deleteButton" src={removeIcon} onClick={()=>{removeData(data.dataID, ()=>{updateMyData(setMySatData)})}}/>
                                                </div>
                                            ):(<></>)}
                                        </div>
                                    ):(
                                        data[category[1]]!==null ? (data[category[1]]):("-")
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </table>
            </div>
            <div className="New">
                <select onChange={(event)=>{setUpSat(event.target.value)}} >
                    <option value="" disabled selected>Select a Satellite</option>
                    <option value="meteor_hrpt">Meteor - HRPT</option>
                    <option value="meteor_m2-x_lrpt">Meteor M2-x - LRPT</option>
                    <option value="metop_ahrtp">Metop - AHRPT</option>
                    <option value="noaa_hrpt">Noaa - HRPT</option>   
                    <option value="noaa_apt">Noaa - APT(wav)</option>   
                </select>
                <input type={"file"} onChange={(event)=>{setUpFile(event.target.files)}}/>
                <button disabled={(upFile === undefined)||(upSat === "")} onClick={()=>{uploadFile(upFile, upSat, setUploadProgress)}}>Upload</button>
                {uploadProgress===0 ? (<></>):(
                    <progress value={uploadProgress} max="100">{uploadProgress}</progress>
                )}
                <p>The page reloads after upload is done</p>
            </div>
        </div>
    </div>
    )
}

export default MyData;