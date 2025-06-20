const express = require("express");
const { register, login ,logout, getProfile, deleteUser, editProfile,getSuggestedusers, sendOTP, verifyOTP} = require("../controllers/user.controller");
const isAuthenticate = require("../middleware/isAuthenticate");
const validate = require("../middleware/validateMiddleware");
const userSchema = require("../validator/userValidator");
const router = express.Router();

router.route("/register").post(validate(userSchema),register);
router.route("/login").post(login);
router.route("/getProfile").get(isAuthenticate ,getProfile);
router.route("/logout").get(isAuthenticate ,logout);
router.route("/delete").delete(isAuthenticate,deleteUser);
router.route("/editProfile").post(isAuthenticate,editProfile);
router.route("/suggested").get(isAuthenticate,getSuggestedusers);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

module.exports=router;