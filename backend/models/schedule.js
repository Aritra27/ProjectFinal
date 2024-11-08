const mongoose = require('mongoose');

const schedule_schema = new mongoose.Schema({
  portId: { type: mongoose.Schema.ObjectId, ref: "Port" },
  shipId: { type: mongoose.Schema.ObjectId, ref: "Ship" },
  content_type: { type: String, enum: ["food", "Material"], required: true },
  arrival_time: { type: Date, required: true },
  priority: { type: Number, default: 0 },
  departure_time: { type: Date, required: true },  // Changed from dock_time
  berthId: { type: mongoose.Schema.ObjectId, ref: "Berth" },
});

const Schedule = mongoose.model("Schedule", schedule_schema);

module.exports = Schedule;
