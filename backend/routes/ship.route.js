const express = require("express");
const { registerShip, getShipDetails,deleteShip,allUserShip, shipDashboard } = require("../controllers/ship.controller");
const isShipOwner = require("../middleware/isShipOwner");

const router = express.Router();

router.route("/ship_register").post(isShipOwner,registerShip);
router.route("/getAllShip").get(isShipOwner,allUserShip);

router.route("/:id/ship_details").get(getShipDetails);
router.route('/shipdashboard/:id').get(shipDashboard);
router.route("/:ownerid/:id/deleteShip").delete(deleteShip);

module.exports=router;