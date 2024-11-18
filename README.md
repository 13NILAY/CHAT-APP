# Chat Application
This project is a real-time chat application built with React (Vite), Node.js, Express, MongoDB, and Socket.IO. It supports private messaging, user authentication, online user tracking, and typing indicators.

## Features
- Real-Time Messaging: Communicate instantly via WebSocket.
- Private Messaging: Secure conversations between specific users.
- User Authentication: JWT-based login, logout, and token refresh.
- Online User Tracking: Displays a list of currently online users.
- Typing Indicator: Shows when a user is typing.
- Persistent Chat History: Messages are stored in MongoDB.
- Responsive Design: Mobile-friendly interface.
---

## Project Structure

### Frontend
The frontend is built with React using Vite for fast development and optimized builds.
- Pages:
  - ChatDashboard: The main chat interface.
  - Login: User login page.
  - Register: User registration page.
- Custom Hooks:
  - useAuth: Manages authentication state.
  - useAxiosPrivate: Configures an Axios instance for making authenticated API requests.
- Components:
  - Header: Displays the application header.
Frontend Commands:
- Install dependencies:
  bash
  npm install
  
- Run the development server:
  bash
  npm run dev
  
---
### Backend
The backend is a Node.js application using Express for the API and Socket.IO for real-time communication.
- Key Features:
  - JWT authentication middleware (verifyJWT).
  - Routes for user management, messaging, and authentication.
  - MongoDB for persistent data storage.
Backend Commands:
- Install dependencies:
  bash
  npm install
  
- Run the server with Nodemon:
  bash
  nodemon app.js
  
---
## Installation and Setup
### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or a cloud instance)
### Steps
1. Clone the repository:
   bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   
2. Set up the backend:
   - Navigate to the server folder:
     bash
     cd server
     
   - Create a .env file with the following:
     env
     PORT=8080
     URL=mongodb://localhost:27017/chatapp
     ACCESS_TOKEN_SECRET=youraccesstokensecret
     REFRESH_TOKEN_SECRET=yourrefreshtokensecret
     
   - Install backend dependencies:
     bash
     npm install
     
   - Start the backend:
     bash
     nodemon app.js
     
3. Set up the frontend:
   - Navigate to the client folder:
     bash
     cd client
     
   - Install frontend dependencies:
     bash
     npm install
     
   - Start the frontend:
     bash
     npm run dev
     
4. Access the application:
   - Open your browser and go to http://localhost:5173.
---
## API Endpoints
### Public Routes
- POST /register: Register a new user.
- POST /login: Authenticate a user.
- GET /refresh: Refresh access token.
- GET /logout: Log out a user.
### Protected Routes (Requires JWT)
- GET /users/:email: Fetch user details.
- GET /users/all: List all users.
- GET /api/messages/:userId: Fetch chat history with a specific user.
---
## Socket.IO Events
- user_connected: Registers a user as online.
- private_message: Sends a private message.
- typing: Notifies when a user is typing.
- stop_typing: Notifies when a user stops typing.
- disconnect: Handles user disconnection.
---
## Notes
- Ensure your MongoDB instance is running before starting the server.
- Use environment variables to configure sensitive data like secrets and database URLs.
---
## License
This project is licensed under the MIT License.

Provide a README.md file