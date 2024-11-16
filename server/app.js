const express=require('express');
const app=express();
const mongoose =require ('mongoose');
const cors=require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const verifyJWT=require('./middleware/verifyJWT');
const corsOptions=require("./config/corsOptions");
const credentials=require("./middleware/verifyJWT")
const PORT=process.env.PORT || 8080;
const URL=process.env.URL;


const dbconnect =async()=>{
    try {
        const uri = URL;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB ');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

// app.use(credentials);

// app.use(cors(corsOptions));

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // If you are using cookies or authorization headers
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());


//routes
app.use('/',require('./routes/register'));
app.use("/login",require('./routes/auth'));
app.use("/refresh" ,require('./routes/refresh'));
app.use("/logout" ,require("./routes/logout"));

app.use(verifyJWT);
app.use('/users',require('./routes/user'));


app.listen(PORT,()=>{
    console.log("Server is running on Port",PORT);
    dbconnect();
})