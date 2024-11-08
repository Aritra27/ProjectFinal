const mongoose = require('mongoose')
const berth_schema = new mongoose.Schema({
    name: { type: String, required: true },
    schedules: [{ type: mongoose.Schema.ObjectId, ref: "Schedule" }],
    portId: {type: String,required: true}
});

const Berth = new mongoose.model('Berth',berth_schema);

module.exports=Berth