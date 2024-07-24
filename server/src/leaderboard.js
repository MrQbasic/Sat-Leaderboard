import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload"

const leaderboard = express();
leaderboard.use(cors());
leaderboard.use(express.json());
leaderboard.use(fileUpload());

import { checkDatabase } from "./sql.js";
checkDatabase();

import routeLogin from "./actions/Login.js";
routeLogin(leaderboard);

import {routeFileUpload} from "./actions/FileUpload.js";
routeFileUpload(leaderboard);

import routeMyData from "./actions/MyData.js";
routeMyData(leaderboard);

import routeLeaderboard from "./actions/Leaderboard.js";
routeLeaderboard(leaderboard);

import routeRemove from "./actions/Remove.js";
routeRemove(leaderboard);

import installSatdump from "./satdump.js"
installSatdump();

export default leaderboard;