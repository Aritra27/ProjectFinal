const express = require("express");
const { registerPort,getPortDetails,allUserPort, getPortListCountrywise, portdashboard} = require("../controllers/port.controller");
const isPortManager = require("../middleware/isPortManager");

const router = express.Router();

router.route("/port_register").post(isPortManager,registerPort);
router.route("/getAllPort").get(isPortManager,allUserPort);
router.route("/:id/getAllPortCountrywise").get(getPortListCountrywise);
router.route("/:id/port_details").get(getPortDetails);
router.route("/portdashboard/:id").get(portdashboard);



module.exports=router;