const express = require('express')
const router = express.Router();
const usersController =require('../controller/usersController');


router.route('/:email')
        .get(usersController.getUser)
        .delete(usersController.delUser)
        .put(usersController.updateUser);

router.route('/all')
        .get(usersController.getAllUser)


module.exports =router ;          