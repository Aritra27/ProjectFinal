const Ship = require("../models/ship");
const User = require("../models/user");
const Port = require("../models/port");
const axios = require("axios");
const Schedule = require("../models/schedule");

const registerShip = async (req, res) => {
  try {
    const { shipName, shipType, shipReg, country } = req.body;
    const ownerId = req.id;
    if (!shipName || !shipType || !shipReg || !country) {
      return res.status(401).json({
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
    const shipExist = await Ship.findOne({ shipReg });
    if (shipExist) {
      return res.status(401).res.json({
        message: "This ship is already registered",
        successes: false,
      });
    }
    const ship = await Ship.create({
      shipName,
      ownerId,
      shipType,
      shipReg,
      country,
    });
    // const user = await User.findById(ownerId);
    // if (user) {
    //   user.ships.push(ship._id);
    //   await user.save();
    // }
    return res.status(201).json({
      message: "ship added successfully successfully",
      success: true,
      ship,
    });
  } catch (error) {
    console.log(error);
  }
};
const allUserShip = async (req, res) => {
  try {
    const ownerId = req.id;
    const ships = await Ship.find({ ownerId });
    if (!ships.length) {
      return res.status(200).json({
        ships: [],
        success: true,
      });
    }
    console.log(ships);
    return res.status(200).json({
      ships: ships,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getShipDetails = async (req, res) => {
  try {
    const shipId = req.params.id;
    let ship = await Ship.findById(shipId).populate({
      path: "ownerId",
      select: "name email",
    });
    if (!ship) {
      return res.status(404).json({
        message: "Ship not found",
        success: false,
      });
    }
    return res.status(200).json({
      ship,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteShip = async (req, res) => {
  try {
    const ownerId = req.params.ownerid;
    const shipId = req.params.id;

    const shipExist = await Ship.findById(shipId);
    if (!shipExist) {
      return res.status(404).json({
        message: "Ship does not exist",
        success: false,
      });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Delete all schedules for this ship
    await Schedule.deleteMany({ shipId });

    // ✅ Delete the ship
    await Ship.deleteOne({ _id: shipId });

    return res.status(200).json({
      message: "Ship and related schedules deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting ship:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const shipDashboard = async (req, res) => {
  try {
    const ownerId = req.params.id;

    const ships = await Ship.find({ ownerId });
    const schedules = await Schedule.find({ shipOwnerId: ownerId });

    const upcomingTrips = schedules.filter(
      (s) => new Date(s.arrival_time) > new Date()
    );

    // Group by port name for chart
    const tripsPerPort = {};
    for (const s of schedules) {
      const portName = s.portId; // If portId is name. If it's ObjectId, populate it.
      tripsPerPort[portName] = (tripsPerPort[portName] || 0) + 1;
    }

    res.json({
      totalShips: ships.length,
      scheduledTrips: schedules.length,
      upcomingTrips: upcomingTrips.length,
      registeredPorts: Object.keys(tripsPerPort).length,
      tripsPerPort: Object.entries(tripsPerPort).map(([port, trips]) => ({
        port,
        trips,
      })),
      upcomingList: upcomingTrips.slice(0, 5).map((s) => ({
        ship:
          ships.find((ship) => ship._id.equals(s.shipId))?.shipName ||
          "Unknown",
        port: s.portId,
        arrival: s.arrival_time,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch ship dashboard");
  }
};

module.exports = {
  registerShip,
  getShipDetails,
  deleteShip,
  allUserShip,
  shipDashboard,
};
