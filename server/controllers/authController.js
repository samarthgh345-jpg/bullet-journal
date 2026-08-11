const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* =========================
   CREATE JWT
========================= */

const createToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* =========================
   REGISTER
========================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* ---------- VALIDATION ---------- */

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    /* ---------- CHECK EXISTING USER ---------- */

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    /* ---------- HASH PASSWORD ---------- */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------- CREATE USER ---------- */

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    /* ---------- TOKEN ---------- */

    const token = createToken(user._id);

    /* ---------- RESPONSE ---------- */

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error while creating account.",
    });
  }
};

/* =========================
   LOGIN
========================= */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ---------- VALIDATION ---------- */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    /* ---------- FIND USER ---------- */

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* ---------- CHECK PASSWORD ---------- */

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* ---------- TOKEN ---------- */

    const token = createToken(user._id);

    /* ---------- RESPONSE ---------- */

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error while logging in.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
