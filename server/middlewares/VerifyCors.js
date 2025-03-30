const cors = require("cors");

const allowedOrigins = ["http://localhost:5173/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // callback(new Error("Not allowed by CORS"));
      callback(null, true);
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS", 
  allowedHeaders: "Content-Type, Authorization",
  credentials: false, // Enable cookies to be sent
};

module.exports = cors(corsOptions);
        