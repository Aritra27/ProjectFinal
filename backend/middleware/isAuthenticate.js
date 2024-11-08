const jwt = require("jsonwebtoken");

const isAuthenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "user is not authenticated",
        success: false,
      });
    }
    const decoder = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoder) {
      return res.status(401).json({
        message: "invalid jwt token",
        success: false,
      });
    }
    req.id = decoder.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = isAuthenticate;
