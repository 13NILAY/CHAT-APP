const Message=require("../model/message");

const getMessage= async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, recipient: req.params.userId },
          { sender: req.params.userId, recipient: req.user.id }
        ]
      })
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .sort({ timestamp: 1 })
      .limit(50);
      
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
  };

  module.exports = {getMessage}