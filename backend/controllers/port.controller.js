const Berth = require("../models/berth");
const Port = require("../models/port");
const User = require("../models/user");

const registerPort = async (req, res) => {
  try {
    const { portId, max_berth, timeTakenPerContent, cost_per_time } = req.body;
    const ownerId = req.id;
    if (
      !portId ||
      !ownerId ||
      !max_berth ||
      !timeTakenPerContent ||
      !cost_per_time
    ) {
      return res.status(401).res.json({
        message: "something is missing",
        successes: false,
      });
    }
    const portExist = await Port.findOne({ portId });
    if (portExist) {
      return res.status(401).json({
        message: "This port is already registered",
        successes: false,
      });
    }
    let berthIds = [];
    for (let i = 1; i <= max_berth; i++) {
      const berthName = `b${i}`; // Berth names like b1, b2, etc.

      // Create a new berth
      const berth = new Berth({
        name: berthName,
        schedules: [],
        portId: portId,
      });

      // Save berth and store its ObjectId
      const savedBerth = await berth.save();
      berthIds.push(savedBerth._id);
    }

    // Create the port with the generated berth references
    const port = await Port.create({
      portId,
      ownerId,
      max_berth,
      available_berth: max_berth, // Initially all berths are available
      berths: berthIds, // Array of berth ObjectIds
      timeTakenPerContent,
      cost_per_time,
    });

    const user = await User.findById(ownerId);
    if (user) {
      user.ports.push(port._id);
      await user.save();
    }
    return res.status(201).json({
      message: "port added successfully successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const allUserPort = async (req,res)=>{
  try {
    const ownerId = req.id;
    const ports = await Port.find({ ownerId });
    if(!ports.length){
      return res.status(200).json({
        ports:[],
        success:true
      })
    }
    return res.status(200).json({
      ports:ships,
      success:true
    })
    
  } catch (error) {
    console.log(error);
  }
};

const getPortDetails = async (req, res) => {
  try {
    const portId = req.params.id;
    let port = await Port.findById(portId).populate({
      path: "ownerId",
      select: "name email",
    });
    if (!port) {
      return res.status(404).json({
        message: "port not found",
        success: false,
      });
    }
    return res.status(200).json({
      port,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getPortList = async (req, res) => {
  try {
    const ports = await Port.find();
    if (!ports) {
      return res.status(400).json({
        message: "no port found",
        success: false,
      });
    }
    return res.status(400).json({
      message: "no port found",
      ports,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const editPort = async (req, res) => {
  try {
    const portId = req.params.portId; // Get portId from request params
    const { max_berth, timeTakenPerContent, cost_per_time } = req.body;

    // Validate if portId exists
    const existingPort = await Port.findById(portId);
    if (!existingPort) {
      return res.status(404).json({
        message: "Port not found",
        success: false,
      });
    }
    let berthIds = [];
    if (max_berth > existingPort.max_berth) {
      for (let i = existingPort.max_berth + 1; i <= max_berth; i++) {
        const berthName = `b${i}`; // Berth names like b1, b2, etc.

        // Create a new berth
        const berth = new Berth({
          name: berthName,
          schedules: [],
          portId: portId,
        });

        // Save berth and store its ObjectId
        const savedBerth = await berth.save();
        berthIds.push(savedBerth._id);
      }
    }

    // Update editable fields (excluding portId and ownerId)
    existingPort.max_berth = max_berth || existingPort.max_berth; // Use existing value if not provided
    existingPort.available_berth = max_berth || existingPort.available_berth;
    existingPort.timeTakenPerContent =
      timeTakenPerContent || existingPort.timeTakenPerContent;
    existingPort.cost_per_time = cost_per_time || existingPort.cost_per_time;
    existingPort.berths = [...existingPort.berths, ...berthIds];

    await existingPort.save();

    return res.status(200).json({
      port: existingPort,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating port profile",
      success: false,
    });
  }
};

module.exports = { registerPort, getPortDetails, getPortList, editPort,allUserPort };
