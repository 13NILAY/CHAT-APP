// import { useState,useEffect } from "react";
// import React from "react";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// const JoinRoom = ({ onRoomJoined }) => {
//     const axiosPrivate=useAxiosPrivate();
//     const [joinData, setJoinData] = useState({
//       roomName: '',
//       accessKey: ''
//     });
  
//     const handleJoin = async (e) => {
//       e.preventDefault();
//       try {
//         const response = await axiosPrivate.post('/api/rooms/join', joinData);
//         console.log(response);
//         const { room } = response.data;
        
//         // Store access key in localStorage or state management
//         localStorage.setItem(`room_${room._id}_key`, joinData.accessKey);
        
//         onRoomJoined(room);
//       } catch (error) {
//         console.error('Error joining room:', error);
//       }
//     };
  
//     return (
//       <form onSubmit={handleJoin} className="space-y-4">
//         <div>
//           <input
//             type="text"
//             placeholder="Room Name"
//             value={joinData.roomName}
//             onChange={(e) => setJoinData(prev => ({
//               ...prev,
//               roomName: e.target.value
//             }))}
//             className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             placeholder="Access Key"
//             value={joinData.accessKey}
//             onChange={(e) => setJoinData(prev => ({
//               ...prev,
//               accessKey: e.target.value
//             }))}
//             className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </div>
//         <button 
//           type="submit"
//           className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
//         >
//           Join Room
//         </button>
//       </form>
//     );
//   };

//   export default JoinRoom