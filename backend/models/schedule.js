const mongoose = require('mongoose');

const schedule_schema = new mongoose.Schema({
  shipOwnerId:{type: mongoose.Schema.ObjectId, ref: "User" },
  portOwnerId:{type: mongoose.Schema.ObjectId, ref: "User" },
  portId: { type: String,required:true},
  shipId: { type: mongoose.Schema.ObjectId, ref: "Ship" },
  content_type: { type: String, enum: ["food", "material"], required: true },
  arrival_time: { type: Date, required: true },
  priority: { type: Number, default: 0 },
  departure_time: { type: Date, required: true },  // Changed from dock_time
  berthId: { type: mongoose.Schema.ObjectId, ref: "Berth" },
  state: { type: String, enum: ["scheduled", "arrived","docked","leave","cancel"], default:"scheduled" }
});

const Schedule = mongoose.model("Schedule", schedule_schema);

module.exports = Schedule;
