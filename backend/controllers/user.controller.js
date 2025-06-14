const Port = require("../models/port");
const Ship = require("../models/ship");
const User = require("../models/user");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(401).json({
        message: "something is missing",
        success: false,
      });
    }
    const userExist = await User.findOne({ email });
    console.log(userExist);
    if (userExist) {
      return res.status(401).json({
        message: "user already exist",
        success: false,
      });
    }
    await User.create({
      name,
      email,
      password,
      role,
    });
    return res.status(201).json({
      message: "account created successfully",
      success: true,
    });
  } catch (error) {
    console.log("error from user controller " + error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "user not exist",
        success: false,
      });
    }

    const userMatch = await user.comparePassword(password);
    if (!userMatch) {
      return res.status(404).json({
        message: "invalid password",
        success: false,
      });
    }

    const token = await user.generateToken();

    // let populatedPorts = [];
    // let populatedShips = [];

    // if (user.role === "portManager") {
    //   populatedPorts = (
    //     await Promise.all(
    //       user.ports.map(async (portId) => {
    //         const port = await Port.findById(portId);
    //         if (port.ownerId.equals(user._id)) {
    //           return port;
    //         }
    //         return null;
    //       })
    //     )
    //   ).filter(Boolean);
    // } else if (user.role === "shipOwner") {
    //   populatedShips = (
    //     await Promise.all(
    //       user.ships.map(async (shipId) => {
    //         const ship = await Ship.findById(shipId);
    //         if (ship.ownerId.equals(user._id)) {
    //           return ship;
    //         }
    //         return null;
    //       })
    //     )
    //   ).filter(Boolean);
    // }

    // const responseUser = {
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   ...(user.role === "portManager" && { ports: populatedPorts }),
    //   ...(user.role === "shipOwner" && { ships: populatedShips }),
    // };
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `welcome back ${user.name}`,
        success: true,
        user: responseUser,
        token: token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const ownerId = req.id;
    const { name, email } = req.body;
    const user = await User.findById(ownerId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not authenticated",
      });
    }
    user.name = name;
    user.email = email;

    user.save();

    return res.status(200).json({
      user,
      success: true,
      message: "user data edited successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const ownerId = req.id;
    const user = await User.findById(ownerId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not authenticated",
      });
    }
    return res.status(401).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const ownerId = req.id;
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(200).json({
        message: "user not exist",
        success: false,
      });
    }
    await User.deleteOne({ _id: ownerId });
    if (user.role === "portManager") {
      await Port.deleteMany({ ownerId: ownerId });
    } else if (user.role === "shipOwner") {
      await Ship.deleteMany({ ownerId: ownerId });
    }
    return res.status(200).json({
      message: "user deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSuggestedusers = async (req, res) => {
  try {
    // Fetch current user
    const currentUser = await User.findById(req.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Determine target role based on current user role
    const targetRole =
      currentUser.role === "portManager" ? "shipOwner" : "portManager";

    // Fetch users with opposite role, excluding the current user
    const suggestedUsers = await User.find({
      _id: { $ne: req.id },
      role: targetRole,
    }).select("-password");

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for the opposite role",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  deleteUser,
  editProfile,
  getSuggestedusers
};
