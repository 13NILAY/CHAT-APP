// // controllers/roomController.js
// const Message =require("../model/message")
// const Room =require("../model/room");
// // const  generateAccessKey =require('../utils/helpers')

// const createRoom = async (req, res) => {
//   try {
//     const { name, accessKey } = req.body;
//      // Generate a unique access key

//     const room = new Room({
//       name,
//       createdBy: req.user._id,
//       accessKey,
//       members: [req.user._id] // Add creator as first member
//     });

//     await room.save();

//     // Emit socket event for room creation
//  if(req.io){
//     req.io.emit('room_created', {
//       roomId: room._id,
//       name: room.name,
//       createdBy: req.user.username
//     });
// }

//     res.status(201).json({
//       success: true,
//       room,
//       accessKey // Send access key back to creator
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating room',
//       error: error.message
//     });
//   }
// };

// const joinRoom = async (req, res) => {
//   try {
//     const { roomName, accessKey } = req.body;

//     const room = await Room.findOne({name:roomName});
//     if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: 'Room not found'
//       });
//     }

//     // Verify access key
//     if (room.accessKey !== accessKey) {
//       return res.status(403).json({
//         success: false,
//         message: 'Invalid access key'
//       });
//     }

//     // Check if user is already a member
//     if (!room.members.includes(req.user._id)) {
//         room.members.push(req.user._id);
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: 'You are already a member of this room'
//     //   });
//     }

//     // Add user to room members
//     // room.members.push(req.user._id);
//     await room.save();

//     // Emit socket event for new member
//     if(req.io){
//     req.io.to(roomName).emit('member_joined', {
//       userId: req.user._id,
//       username: req.user.username
//     });
// }

//     res.status(200).json({
//       success: true,
//       room
//     });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       success: false,
//       message: 'Error joining room',
//       error: error.message
//     });
//   }
// };

// // Get room messages with pagination
//  const getRoomMessages = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;

//     const messages = await Message.find({ room: roomId })
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .populate('sender', 'username')
//       .lean();

//     res.status(200).json({
//       success: true,
//       messages: messages.reverse(), // Send in chronological order
//       page,
//       limit
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching messages',
//       error: error.message
//     });
//   }
// };

// module.exports={getRoomMessages,createRoom,joinRoom}