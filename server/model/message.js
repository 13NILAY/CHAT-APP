const mongoose=require('mongoose');
const validator =require('validator');
const Schema =mongoose.Schema

const messageSchema =new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    messageContent:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Message =mongoose.model('Message',messageSchema);

Message.syncIndexes().then(()=>{
    console.log("Indexes are synchronized");
}).catch(err=>{
    console.log("Error Synchronizing");
});

module.exports =Message;