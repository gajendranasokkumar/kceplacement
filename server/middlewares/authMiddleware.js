const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" }); // Return 401 if token is missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" }); // Return 403 if role is not admin
    }
    req.user = decoded; // Attach decoded token to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" }); // Return 401 if token is invalid
  }
};
