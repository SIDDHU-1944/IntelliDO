

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import client from "./src/utils/environment.js";
import path from "path"
import { fileURLToPath } from "url";

dotenv.config()

const app = express();

const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename); // in esr dirname is not defined so recreating it.

app.set("port", process.env.PORT || 3000);
app.use(cors({
  origin: client, // your frontend URL
  credentials: true
}))
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);


app.get("/", (req,res)=>{
    res.send("hello world!!");
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});


async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
}

main().then(()=>{
    console.log("connected to db");
    app.listen(app.get("port"), ()=>{
        console.log(`server is listening on ${app.get("port")}`);
    })
})
.catch((err)=>{
    console.log(err);
})



