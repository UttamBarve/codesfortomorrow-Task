const express = require("express");
const {registerUser,loginUser,refreshAccessToken} = require("../controller/user");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessToken);

module.exports = router;