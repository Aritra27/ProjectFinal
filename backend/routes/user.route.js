const express = require("express");
const { register, login ,logout, getProfile, deleteUser} = require("../controllers/user.controller");
const isAuthenticate = require("../middleware/isAuthenticate");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getProfile").get(isAuthenticate ,getProfile);
router.route("/logout").get(isAuthenticate ,logout);
router.route("/delete").delete(isAuthenticate,deleteUser)

module.exports=router;