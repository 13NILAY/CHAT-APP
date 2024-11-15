const express=require('express');
const app=express();
const mongoose =require ('mongoose');
const cors=require('cors');
require('dotenv').config();
const path =require('path');

const PORT=process.env.PORT || 8080;
const URL=process.env.MongoDB_URL;

const dbconnect =async()=>{
    await mongoose.connect(URL)
    .then(()=>{
        console.log(connected);
    }).catch((err)=>{
        console.log(err);
    })
}

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.listen(PORT,()=>{
    console.log("Server is running on Port",PORT);
    dbconnect();
})