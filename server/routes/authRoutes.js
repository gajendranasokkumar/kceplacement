const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/authController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/login", loginAdmin);

// Example of a protected route
router.get("/protected", verifyAdmin, (req, res) => {
  res.status(200).json({ message: "You have access to this route", user: req.user });
});

module.exports = router;
