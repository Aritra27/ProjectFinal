const express = require("express");
const { registerShip, getShipDetails,deleteShip,allUserShip } = require("../controllers/ship.controller");
const isShipOwner = require("../middleware/isShipOwner");

const router = express.Router();

router.route("/ship_register").post(isShipOwner,registerShip);
router.route("/getAllShip").get(isShipOwner,allUserShip);

router.route("/:id/ship_details").get(getShipDetails);
router.route("/:id/deleteShip").delete(isShipOwner,deleteShip);

module.exports=router;