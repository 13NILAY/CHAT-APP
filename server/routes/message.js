const express = require('express')
const router = express.Router();
const messageController=require("../controller/messageController");

router.route('/:userId')
        .get(messageController.getMessage)

module.exports =router ;        