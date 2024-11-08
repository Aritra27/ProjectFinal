const express = require("express");
const { registerPort,getPortDetails,allUserPort} = require("../controllers/port.controller");
const isPortManager = require("../middleware/isPortManager");

const router = express.Router();

router.route("/port_register").post(isPortManager,registerPort);
router.route("/getAllPort").post(isPortManager,allUserPort);
router.route("/:id/port_details").get(getPortDetails);


module.exports=router;