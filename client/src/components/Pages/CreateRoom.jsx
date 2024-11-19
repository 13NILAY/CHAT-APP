// import { useEffect, useState } from "react";
// import React from "react";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// const CreateRoom = ({ onRoomCreated }) => {
//   const axiosPrivate=useAxiosPrivate();
//   const [roomData, setRoomData] = useState({
//     name: '',
//     accessKey: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosPrivate.post('/api/rooms/create', roomData);
      
//       const { room, accessKey } = response.data;
      
//       // Store access key in localStorage or state management
//       localStorage.setItem(`room_${room._id}_key`, accessKey);
      
//       onRoomCreated(room);
//     } catch (error) {
//       console.error('Error creating room:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <input
//           type="text"
//           placeholder="Room Name"
//           value={roomData.name}
//           onChange={(e) => setRoomData(prev => ({
//             ...prev,
//             name: e.target.value
//           }))}
//           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//         />
//       </div>
//       <div>
//         <input
//           placeholder="Room Access Key"
//           value={roomData.accessKey}
//           onChange={(e) => setRoomData(prev => ({
//             ...prev,
//             accessKey: e.target.value
//           }))}
//           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           rows="3"
//         />
//       </div>
//       <button 
//         type="submit"
//         className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
//       >
//         Create Room
//       </button>
//     </form>
//   );
// };

// export default CreateRoom