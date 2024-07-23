import { executeQuery } from "../sql.js"

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}


function routeLogin(app){
    console.log("Leaderboard: New Route: /api/login")
    app.post("/api/login", async(req, res) => {
        try {
            if(req.body.clientToken === undefined){
                //get pswHash and username from req
                const password = req.body.password
                const username = req.body.username
                
                //check if a user with that username already exists
                const hits = await executeQuery("SELECT * FROM Users WHERE username = (?)", [username]);

                if(hits.length === 1){
                    //found a user already existing
                    if(hits[0].pswHash === password || 1 === 1){
                        //psw matches so success
                        const clientToken = generate_token(255);
                        //set token
                        executeQuery("UPDATE Users SET clientToken=(?) WHERE userID=(?)", [clientToken, hits[0].userID])

                        res.json({status: "SUCCESS", username: username, clientToken: clientToken})
                    }else{
                        //psw doesnt match
                        res.json({status: "ERROR-PSW"})
                    }
                }else if(hits.length > 1){ //Unexpected
                    //multiple users with same Username
                    console.warn("Leaderboard: Multiple Users with same username exist!")
                    res.status(500);
                }else {
                    //create as one doesnt exist
                    const clientToken = generate_token(255);
                    //create new entry
                    executeQuery("INSERT INTO Users (username, pswHash, clientToken) VALUES ((?),(?),(?))", [username, password, clientToken]);
                    res.json({status: "SUCCESS", username: username, clientToken: clientToken})
                }
            }else{
                //login with clientToken
                const hits = await executeQuery("SELECT * FROM Users WHERE clientToken=(?)", [req.body.clientToken]);
                if(hits.length === 1){
                    res.json({status: "SUCCESS", username: hits[0].username, clientToken: req.body.clientToken})
                }else if(hits.length > 1){
                    console.warn("Leaderboard: Multiple Users with same clientToken!")
                    res.status(500);
                }else{
                    res.json({status: "ERROR-TOKEN"});
                }

            }
        }catch (e) {
            console.error("Leaderboard: ",e)
            res.status(500)
        }
    })
}

export default routeLogin