import "reflect-metadata";
import "dotenv/config";

import mongoose from "mongoose";
import express from "express";
import path from "path";

import { createServer } from "http";
import { Server } from "socket.io";
 
const app = express();
app.use(express.static(path.join(__dirname, "..","..","..","..","public")));

export const server = createServer(app);
export const io = new Server(server);

mongoose.connect("mongodb://localhost/rocketsocket");
