import React, { useState } from 'react';
import { User, Send, LogOut, Upload } from 'lucide-react';

const Footer = () => {
    const [message, setMessage] = useState('');
    const [showImageUpload, setShowImageUpload] = useState(false);
    const socket =new WebSocket('ws://localhost:3000')

    const handleSendMessage = () => {
      // Implement message sending logic here
      if(message)
      console.log('Sending message:', message);
      setMessage('');
    };
  
    const handleImageUpload = (file) => {
      // Implement image upload logic here
      console.log('Uploading image:', file);
      setShowImageUpload(false);
    };
  
    return (
      <footer className="bg-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            <Upload size={20} />
          </button>
        </div>
        {showImageUpload && (
          <div className="absolute bottom-16 right-6 bg-white p-4 rounded-md shadow-md">
            <input
              type="file"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}
      </footer>
    );
  };

export default Footer