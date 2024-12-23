const Ship = require("../models/ship");
const User = require("../models/user");
const axios = require("axios");

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
    console.log(ships)
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
    const ownerId = req.id;
    const shipId = req.params.id;
    const shipExist = await Ship.findById(shipId);
    if (!shipExist) {
      return res.status(401).json({
        message: "ship not exist",
        success: false,
      });
    }
    console.log(shipExist.ownerId, ownerId);
    if (shipExist.ownerId.toString() === ownerId) {
      const user = await User.findById(ownerId);
      if (user) {
        await Ship.deleteOne({ _id: shipId });
        user.ships.pull(shipId);
        await user.save();
        return res.status(201).json({
          message: "ship deleted successfully",
          success: true,
        });
      } else {
        return res.status(401).json({
          message: "error to fetch user",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        message: "you are not authorized to delete this",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { registerShip, getShipDetails, deleteShip, allUserShip };
