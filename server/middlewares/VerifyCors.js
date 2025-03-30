const cors = require("cors");

const allowedOrigins = ["YOUR_ALLOWED_URL_HERE"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS", 
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Enable cookies to be sent
};

module.exports = cors(corsOptions);
        