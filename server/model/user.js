const mongoose=require('mongoose');
const validator =require('validator');
const Schema =mongoose.Schema

const userSchema =new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid e-mail id")
            }
        }
    },
    password:{
        type:String,
        required:true,
    }
});

const User =mongoose.model('User',userSchema);

User.syncIndexes().then(()=>{
    console.log("Indexes are synchronized");
}).catch(err=>{
    console.log("Error Synchronizing");
});

module.exports =User;