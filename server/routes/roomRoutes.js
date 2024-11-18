const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getRoomMessages } = require('../controller/roomController');

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/:roomId/messages', getRoomMessages);

module.exports = router;
