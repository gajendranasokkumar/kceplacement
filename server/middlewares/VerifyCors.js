const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://kceplacement.vercel.app", // Production frontend
];

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
  allowedHeaders: "Content-Type, Authorization", // Ensure Authorization is allowed
  credentials: true, // Enable cookies to be sent
};

module.exports = cors(corsOptions);
