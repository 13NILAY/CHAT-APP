const User =require('../model/user');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');


const handleLogin= async(req,res)=>{
    const cookies =req.cookies ;
    const identity=req.body.identity;
    const password=req.body.password;

    const foundUser=await User.findOne(
        { email: identity }
    );
    if(!foundUser) return res.sendStatus(401);
    //evaluate password
    const match= await bcrypt.compare(password, foundUser.password)
        if(match){
            //create JWTs
            const accessToken=jwt.sign(
                {
                    UserInfo:{
                        username:foundUser.username,
                        email:foundUser.email,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "1d"}
            );
            const newRefreshToken =jwt.sign(
                { "username":foundUser.username ,"email":foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: "30d"}
            )

            let newRefreshTokenArray =
                !cookies?.jwt
                    ? foundUser.refreshToken
                    :foundUser.refreshToken.filter(rt => rt!== cookies.jwt);

            if (cookies?.jwt) res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true}); 
    
            //Saving refresh Token with current user
            foundUser.refreshToken=[...newRefreshTokenArray,newRefreshToken];
            const result= await foundUser.save();
           
            
            //Creates Secure Cookie with refresh Token
             res.cookie('jwt',newRefreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000})
             
             //Send Access Token and Roles to user
             res.json({email:foundUser.email , accessToken});
            
        }else{
            return res.sendStatus(401);
        }
    }
    
 module.exports = { handleLogin };