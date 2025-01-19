const express = require("express");
const { freeSlots, createSchedule, shipSchedules, portSchedules, arriveState, dockedState } = require("../controllers/schedule.controller");
const isShipOwner = require("../middleware/isShipOwner");
const isPortManager = require("../middleware/isPortManager");

const router = express.Router();

router.route("/findSlots").post(isShipOwner,freeSlots);
router.route("/createSchedule").post(isShipOwner,createSchedule);portSchedules,shipSchedules
router.route("/ShipSchedules").get(isShipOwner,shipSchedules);
router.route("/PortSchedules").get(isPortManager,portSchedules);
router.route("/Arrive/:id").put(arriveState);
router.route("/Docked/:id").put(dockedState);

module.exports=router;