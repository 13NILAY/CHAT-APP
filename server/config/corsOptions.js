const allowedOrigins = [
    "https://onechatflow.netlify.app",
    "http://localhost:5173",              // For local testing
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allows cookies and auth headers
  };
  
  module.exports = corsOptions;
  