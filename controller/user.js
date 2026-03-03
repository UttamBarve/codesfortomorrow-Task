const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password:hashPass,
    });
    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message});
  }
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).josn({ message: "Refresh token requires" });
    }
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decode.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.json({ message: "Wrong Token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.json({ message: "wrong token" });
  }
};


module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken
}
