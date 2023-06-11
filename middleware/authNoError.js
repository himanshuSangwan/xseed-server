const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const utils = require("../utils/utils");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = utils.jwtDecode(token);
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      req.currUser = undefined;
    } else {
      req.currUser = user;
    }
    next();
  } catch (e) {
    req.currUser = undefined;
    next();
  }
};
module.exports = auth;
