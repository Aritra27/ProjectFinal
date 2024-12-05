const mongoose = require('mongoose')
const port_schema= new mongoose.Schema({
    portId:{type:String, require:true, unique:true},
    ownerId:{type: mongoose.Schema.ObjectId, ref: "User" },
    max_berth:{type:Number, require:true},
    available_berth:{type:Number,},
    berths:[{ type:mongoose.Schema.ObjectId, ref:"Berth"}],
    timeTakenPerContent: {
        food: { type: Number, default: 0 },
        material: { type: Number, default: 0 }
    },
    cost_per_time:{type:Number, require:true},
    country:{type:String, require:true },
})
 
const Port = mongoose.model("Port",port_schema);

module.exports=Port;