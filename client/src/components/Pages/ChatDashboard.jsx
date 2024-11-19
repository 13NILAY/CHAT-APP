import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, Send, LogOut, Upload, Users, MessageCircle, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Custom Hooks
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import debounce from 'lodash/debounce';

const ChatDashboard = () => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosPrivate.get(`/users/${auth.email}`);
        setUser(userResponse.data);
      } catch (err) {
        setError('Failed to load user data');
        navigate('/login');
      }
    };

    if (auth?.email) fetchUserData();
  }, [auth.email, axiosPrivate, navigate]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('https://chat-app-3x9z.onrender.com', {
      withCredentials: true,
      transports: ['websocket'],
      auth: {
        token: auth.accessToken
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('user_connected', user);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('users_online', (users) => {
      setOnlineUsers(users);
      setLoadingUsers(false);
    });

    newSocket.on('private_message', (message) => {
      setPrivateMessages((prev) => {
        const senderId = message.sender._id;
        const existingMessages = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [...existingMessages, message]
        };
      });
      scrollToBottom();
    });

    newSocket.on('typing', (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.username
      }));
    });

    newSocket.on('stop_typing', (data) => {
      setTypingUsers((prev) => {
        const newTyping = { ...prev };
        delete newTyping[data.userId];
        return newTyping;
      });
    });

    return () => {
      newSocket.close();
    };
  }, [user, auth.accessToken, scrollToBottom]);

  useEffect(() => {
    const fetchPrivateMessages = async () => {
      if (!selectedUser) return;
      setLoadingMessages(true);
      setError(null);

      try {
        const response = await axiosPrivate.get(`/messages/${selectedUser._id}`);
        setPrivateMessages((prev) => ({
          ...prev,
          [selectedUser._id]: response.data
        }));
        scrollToBottom();
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchPrivateMessages();
  }, [selectedUser, axiosPrivate, scrollToBottom]);

  const debouncedStopTyping = useCallback(
    debounce((recipientId) => {
      socket?.emit('stop_typing', { recipientId });
    }, 1500),
    [socket]
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !connected || !selectedUser) return;

    socket.emit('private_message', {
      recipientId: selectedUser._id,
      content: message,
    });

    setPrivateMessages((prev) => ({
      ...prev,
      [selectedUser._id]: [
        ...(prev[selectedUser._id] || []),
        { content: message, sender: { _id: user._id }, recipient: { _id: selectedUser._id } }
      ]
    }));

    setMessage('');
    debouncedStopTyping(selectedUser._id);
  };

  const handleTyping = useCallback((e) => {
    if (!socket || !connected || !selectedUser) return;

    if (e.target.value.trim().length > 0) {
      socket.emit('typing', { recipientId: selectedUser._id });
      debouncedStopTyping(selectedUser._id);
    }
  }, [socket, connected, selectedUser, debouncedStopTyping]);

  const handleLogout = () => {
    socket?.disconnect();
    setAuth({});
    navigate('/login');
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Please Login To View This Page</h1>
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* <Header/> */}
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      
      <button onClick={() => setShowSidebar(!showSidebar)} className="fixed z-50 top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
        {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      {showSidebar && (
        <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto relative">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-medium">{user?.username}</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-sm text-gray-600">{connected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
              <LogOut size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Users size={16} className="text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-500">Online Users ({onlineUsers.length})</h4>
            </div>
            {loadingUsers ? (
              <div className="text-center text-gray-500">Loading users...</div>
            ) : (
              <div className="space-y-2">
                {onlineUsers.map((onlineUser) => (
                  <div key={onlineUser._id} onClick={() => setSelectedUser(onlineUser)} className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer ${selectedUser?._id === onlineUser?._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{onlineUser.username}</p>
                      {typingUsers[onlineUser._id] && (
                        <p className="text-xs text-green-500">{typingUsers[onlineUser._id]} is typing...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          {selectedUser ? <h3 className="text-xl font-semibold">{selectedUser.username}</h3> : <h3 className="text-xl font-semibold">Select a User</h3>}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loadingMessages ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : selectedUser ? (
            <div>
              {(privateMessages[selectedUser._id] || []).map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}>
                  <div className={`${msg.sender._id === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} inline-block p-2 rounded-lg`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-center text-gray-500">No messages yet</div>
          )}
        </div>
        <form className="p-4 bg-gray-100 border-t border-gray-200 flex items-center" onSubmit={handleSendMessage}>
          <input value={message} onChange={(e) => { setMessage(e.target.value); handleTyping(e); }} type="text" className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none" placeholder="Type your message here..." />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-md">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
    </main>
  );
};

export default ChatDashboard;
