const jwt = require("jsonwebtoken");

const isShipOwner = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "user is not authenticated",
        success: true,
      });
    }
    const decoder = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoder) {
      return res.status(401).json({
        message: "invalid jwt token",
        success: false,
      });
    }
    if (decoder.role != "portManager") {
      return res.status(401).json({
        message: "unauthorized entry point",
        success: false,
      });
    }
    req.id = decoder.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = isShipOwner;
