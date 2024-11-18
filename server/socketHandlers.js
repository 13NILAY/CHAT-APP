// const jwt = require('jsonwebtoken');
// const Message = require('./model/message');
// const Room = require('./model/room');

// const decodeToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     return {
//       _id: decoded.UserInfo.id,
//       username: decoded.UserInfo.username,
//     };
//   } catch (error) {
//     throw new Error('Invalid token');
//   }
// };

// const setupSocketHandlers = (io) => {
//   const connectedUsers = new Map();

//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
//       if (!token) {
//         return next(new Error('Authentication required'));
//       }

//       const user = decodeToken(token);
//       if (!user._id || !user.username) {
//         return next(new Error('Invalid user data'));
//       }

//       socket.user = user;
//       next();
//     } catch (error) {
//       return next(new Error('Authentication failed'));
//     }
//   });

//   io.on('connection', (socket) => {
//     if (!socket.user?._id) {
//       socket.disconnect();
//       return;
//     }

//     console.log('User connected:', socket.user.username);

//     connectedUsers.set(socket.user._id.toString(), {
//       socketId: socket.id,
//       user: socket.user,
//     });

//     const broadcastOnlineUsers = (roomId) => {
//       try {
//         const onlineUsers = Array.from(connectedUsers.values()).map(({ user }) => user);
//         if (roomId) {
//           io.to(roomId).emit('users_online', onlineUsers);
//         } else {
//           io.emit('users_online', onlineUsers);
//         }
//       } catch (error) {
//         console.error('Error broadcasting online users:', error);
//       }
//     };

//     broadcastOnlineUsers();
//     io.emit('user_joined', socket.user);

//     socket.on('join_room', async ({ roomId }) => {
//       if (!roomId) {
//         socket.emit('error', { message: 'Room ID is required' });
//         return;
//       }

//       try {
//         const room = await Room.findById(roomId)
//           .populate('members', 'username')
//           .exec();

//         if (!room) {
//           socket.emit('error', { message: 'Room not found' });
//           return;
//         }

//         const isMember = room.members.some(
//           (member) => member._id.toString() === socket.user._id.toString()
//         );

//         if (!isMember) {
//           socket.emit('error', { message: 'Not authorized to join this room' });
//           return;
//         }

//         const roomsToLeave = Array.from(socket.rooms).filter((room) => room !== socket.id);
//         roomsToLeave.forEach((room) => socket.leave(room));

//         await socket.join(roomId);
//         console.log(`${socket.user.username} joined room: ${roomId}`);

//         const previousMessages = await Message.find({ room: roomId })
//           .populate('sender', 'username')
//           .sort({ createdAt: -1 })
//           .limit(50)
//           .exec();

//         socket.emit('previous_messages', previousMessages.reverse());
//         broadcastOnlineUsers(roomId);
//       } catch (error) {
//         console.error('Error joining room:', error);
//         socket.emit('error', { message: 'Failed to join room' });
//       }
//     });

//     socket.on('send_message', async ({ roomId, content, messageType = 'text' }) => {
//       if (!roomId || !content) {
//         socket.emit('error', { message: 'Room ID and content are required' });
//         return;
//       }

//       try {
//         const room = await Room.findOne({
//           _id: roomId,
//           members: socket.user._id,
//         }).exec();

//         if (!room) {
//           socket.emit('error', { message: 'Not authorized to send messages in this room' });
//           return;
//         }

//         const message = await Message.create({
//           room: roomId,
//           sender: socket.user._id,
//           content,
//           messageType,
//           readBy: [{ user: socket.user._id, readAt: new Date() }],
//         });

//         await message.populate('sender', 'username');

//         io.to(roomId).emit('new_message', {
//           _id: message._id,
//           content: message.content,
//           messageType: message.messageType,
//           sender: {
//             _id: socket.user._id,
//             username: socket.user.username,
//           },
//           createdAt: message.createdAt,
//         });
//       } catch (error) {
//         console.error('Error sending message:', error);
//         socket.emit('error', { message: 'Failed to send message' });
//       }
//     });

//     let lastTypingEmit = 0;

//     socket.on('typing', ({ roomId, username }) => {
//       if (!roomId) return;

//       const now = Date.now();
//       if (now - lastTypingEmit > 2000) {
//         io.to(roomId).emit('user_typing', { userId: socket.user._id, username });
//         lastTypingEmit = now;
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.user.username);
//       connectedUsers.delete(socket.user._id.toString());
//       io.emit('user_left', socket.user);
//       broadcastOnlineUsers();
//     });
//   });
// };

// module.exports = setupSocketHandlers;
