import React, { useState } from 'react';
import { User, Send, LogOut, Upload } from 'lucide-react';
// import { handleLogout } from '../../../server/controller/logoutController';
import useLogout from '../hooks/useLogout';
// Header Component
const Header = () => {
    const logout=useLogout();
    const handleClick=async()=>{
        await logout();
    }
  return (
    <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <User className="text-blue-500" size={20} />
        </div>
        <h2 className="font-semibold text-lg">Chat App</h2>
      </div>
      <button onClick={handleClick} className="text-white hover:text-gray-200">
        <LogOut size={20} />
      </button>
    </header>
  );
};

export default Header