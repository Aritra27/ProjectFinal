const Berth = require("../models/berth");
const Port = require("../models/port");
const User = require("../models/user");
const Schedule = require("../models/schedule");


const registerPort = async (req, res) => {
  try {
    const { portId, max_berth, timeTakenPerContent, cost_per_time, country  } = req.body;
    const ownerId = req.id;
    if (
      !portId ||
      !ownerId ||
      !max_berth ||
      !timeTakenPerContent ||
      !cost_per_time ||
      !country
    ) {
      return res.status(401).res.json({
        message: "something is missing",
        successes: false,
      });
    }

    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${country}?fullText=true`
      );
    } catch (error) {
      if (error.response) {
        return res.status(400).json({
          message: "Invalid country name. Please provide a valid country.",
          success: false,
        });
      }
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
      country,
    });

    // const user = await User.findById(ownerId);
    // if (user) {
    //   user.ports.push(port.portId);
    //   await user.save();
    // }
    return res.status(201).json({
      port,
      message: "port added successfully ",
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
      ports:ports,
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

const getPortListCountrywise = async (req, res) => {
  try {
    const country = req.params.id
    const ports = await Port.find({country});
    if (!ports) {
      return res.status(400).json({
        message: "no port found",
        success: false,
      });
    }
    return res.status(200).json({
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




const deletePort = async (req, res) => {
  try {
    const portId = req.params.portId;

    // Check if port exists
    const port = await Port.findById(portId);
    if (!port) {
      return res.status(404).json({ success: false, message: "Port not found" });
    }

    // Find all berths under the port
    const berths = await Berth.find({ portId: portId });

    // Check if any berth has scheduled ships
    for (const berth of berths) {
      const activeSchedules = await Schedule.find({
        berthId: berth._id,
        state: { $in: ["scheduled", "arrived", "docked"] }
      });

      if (activeSchedules.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete port. Active ship schedule(s) found in berth ${berth.name}`,
        });
      }
    }

    // Delete all berths for this port
    await Berth.deleteMany({ portId: portId });

    // Delete the port
    await Port.findByIdAndDelete(portId);

    return res.status(200).json({
      success: true,
      message: "Port and all its berths deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting port",
    });
  }
};

module.exports = deletePort;

// GET /api/port-dashboard/:ownerId

const portdashboard= async (req, res) => {
  try {
    const ownerId = req.params.id;

    const port = await Port.findOne({ ownerId }).populate("berths");
    const schedules = await Schedule.find({ portOwnerId: ownerId });

    const upcoming = schedules
      .filter(s => new Date(s.arrival_time) > new Date())
      .sort((a, b) => new Date(a.arrival_time) - new Date(b.arrival_time))
      .slice(0, 5);

    const trafficData = schedules.reduce((acc, sch) => {
      const date = new Date(sch.arrival_time).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      const entry = acc.find((item) => item.date === date);
      if (entry) entry.ships++;
      else acc.push({ date, ships: 1 });

      return acc;
    }, []);

    res.json({
      totalShips: schedules.length,
      upcomingArrivals: upcoming,
      dockCount: port.berths.length,
      trafficData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Dashboard fetch failed");
  }
};


module.exports = { registerPort, getPortDetails, editPort,deletePort,allUserPort,getPortListCountrywise,portdashboard };
