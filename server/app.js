const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require("./config/corsOptions");
// const credentials = require("./middleware/verifyJWT");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8080;
const URL = process.env.URL;

// Import Message Model
const Message = require("./model/message");

// Database Connection
const dbconnect = async () => {
    try {
        await mongoose.connect(URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Middleware
// app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes before JWT verification
app.use('/', require('./routes/register'));
app.use("/login", require('./routes/auth'));
app.use("/refresh", require('./routes/refresh'));
app.use("/logout", require("./routes/logout"));

// Protected Routes
app.use(verifyJWT);
app.use('/users', require('./routes/user'));
app.use('/messages', require('./routes/message'));
// Server Setup
const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    dbconnect();
});

// Socket.IO Setup
const io = new Server(expressServer, {
    cors: {
      origin: "https://onechatflow.netlify.app/",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  // Track online users
  const onlineUsers = new Map();
  
  io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    
    socket.on('user_connected', (userData) => {
        socket.userData = userData;
        socket.join(userData._id); // Join a room for the user
      
        onlineUsers.set(userData._id.toString(), userData);
      
        const uniqueUsers = Array.from(new Set(
          Array.from(onlineUsers.values()).map(user => user._id)
        )).map(id =>
          Array.from(onlineUsers.values()).find(user => user._id === id)
        );
      
        io.emit('users_online', uniqueUsers);
      });
      
  
    // Handle private messages
socket.on('typing', (data) => {
    
    socket.to(data.recipientId).emit('typing', {
      userId: socket.userData._id,
      username: socket.userData.username
    });
  });
  
  socket.on('stop_typing', (data) => {
    socket.to(data.recipientId).emit('stop_typing', {
      userId: socket.userData._id
    });
  });
  
  socket.on('private_message', async (data) => {
    try {
      const message = new Message({
        sender: socket.userData._id,
        recipient: data.recipientId,
        content: data.content,
        timestamp: new Date(),
      });
  
      const savedMessage = await message.save();
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'username')
        .populate('recipient', 'username');
  
      // Broadcast to the recipient's room
      io.to(data.recipientId).emit('private_message', populatedMessage);
      // Send the message to sender for confirmation
      socket.emit('private_message', populatedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
  
  
    socket.on('disconnect', () => {
      if (socket.userData) {
        onlineUsers.delete(socket.userData._id.toString());
        io.emit('users_online', Array.from(onlineUsers.keys()));
      }
      console.log(`User ${socket.id} disconnected`);
    });
  });
  
  
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = app;