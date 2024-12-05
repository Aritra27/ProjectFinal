const express = require("express");
const { register, login ,logout, getProfile, deleteUser, editProfile} = require("../controllers/user.controller");
const isAuthenticate = require("../middleware/isAuthenticate");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getProfile").get(isAuthenticate ,getProfile);
router.route("/logout").get(isAuthenticate ,logout);
router.route("/delete").delete(isAuthenticate,deleteUser)
router.route("/editProfile").post(isAuthenticate,editProfile)

module.exports=router;