const express = require("express");
const { freeSlots, createSchedule } = require("../controllers/schedule.controller");
const isShipOwner = require("../middleware/isShipOwner");

const router = express.Router();

router.route("/findSlots").post(isShipOwner,freeSlots);
router.route("/createSchedule").post(isShipOwner,createSchedule);


module.exports=router;