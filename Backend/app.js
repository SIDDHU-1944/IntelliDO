

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);


app.get("/", (req,res)=>{
    res.send("hello world!!");
})


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



