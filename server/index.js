const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const { initSocket } = require("./socket");
const excelQueue = require("./queues/excelQueue");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const server = require("http").createServer(app);
initSocket(server); // Initialize socket server

const dbURI = process.env.NODE_ENV === "production"
  ? process.env.MONGODB_URI_PRODUCTION
  : process.env.MONGODB_URI_LOCAL;

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/", routes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
