const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["portManager", "shipOwner"], required: true },
    // ships: [{ type: mongoose.Schema.ObjectId, ref: "Ship" }],
    // ports: [{ type: mongoose.Schema.ObjectId, ref: "Port" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // // Assign empty array based on role
  // if (this.role === "portManager") {
  //   this.ships = undefined // Ensure ships is empty
  // } else if (this.role === "shipOwner") {
  //   this.ports = undefined; // Ensure ports is empty
  // }

  // Hash password if it is modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign({ userId: this._id ,role:this.role}, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.error(error);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
