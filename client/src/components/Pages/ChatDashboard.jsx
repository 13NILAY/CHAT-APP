import React,{useState} from 'react';
import { User, Send, LogOut } from 'lucide-react';
import Header from '../header';
import Footer from '../footer';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const ChatDashboard = () => {
    
    const onlineUsers = ['Alice Smith', 'Bob Johnson', 'Carol White'];
    const offlineUsers = ['David Lee', 'Emily Chen', 'Frank Gonzalez'];
    const {auth} =useAuth();

    if (!auth.isAuthenticated) {
        return (
          <>
            <h1 className="text-2xl">Please Login To view this page</h1>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Link to="/login">Login</Link>
            </button>
          </>
        );
      }
   
    return (
      <div className="h-screen flex flex-col">
        <Header />
  
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Online Users List */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Online Users</h4>
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm">{user}</span>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Offline Users List */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Offline Users</h4>
              <div className="space-y-3">
                {offlineUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm">{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <span className="font-medium">Alice Smith</span>
              </div>
            </div>
  
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Received Message */}
                <div className="flex items-start">
                  <div className="flex-1 max-w-md">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm">Hey! How are you doing?</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">10:30 AM</span>
                  </div>
                </div>
  
                {/* Sent Message */}
                <div className="flex items-start justify-end">
                  <div className="flex-1 max-w-md flex flex-col items-end">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <p className="text-sm text-white">I'm doing great! Thanks for asking.</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">10:31 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <Footer />
      </div>
    );
  };
  
  export default ChatDashboard;