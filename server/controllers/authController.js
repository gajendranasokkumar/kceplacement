const jwt = require("jsonwebtoken");

const ADMIN_CREDENTIALS = {
  email: "admin@kceplacement.com",
  password: "Admin@kceplacement", // Replace with a strong password
};

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      { role: "admin", email }, // Include email and role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
};
