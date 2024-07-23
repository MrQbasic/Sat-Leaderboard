import mysql from "mysql2/promise";

import getDbConfig from "../../../sql-login.mjs";

const dbConfig = {... getDbConfig(), database: "leaderboard"};

const pool = mysql.createPool(dbConfig);

async function executeQuery(sql, values = []) {
    const connection = await pool.getConnection();
    try {
        const [results, fields] = await connection.execute(sql, values);
        return results;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}


const tables = ["SatData", "Users"];

//ret; bool-> status(true: ok / false: error)
function checkDatabase(){
    console.log("Check if all tables are present!");
    try {
        executeQuery("SHOW TABLES;").then((ret) => {
            const foundTables = ret.map(obj => obj.Tables_in_leaderboard);
            tables.forEach(table => {
                if(foundTables.indexOf(table) !== -1){
                    console.log("FOUND:",table);
                }else{
                    console.log("MISSING: "+table);
                    throw Error("MISSING TABLE");
                }
            });
        });
    
    } catch(e) {
        console.log("FAILED: couldn't execute query!");
        console.log("ERROR:",e);
        return false;
    }
    console.log("All Tables Present!");
    return true;
}

export { checkDatabase, executeQuery }; 
