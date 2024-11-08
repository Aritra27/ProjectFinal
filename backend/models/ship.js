const mongoose = require('mongoose')
const ship_schema= new mongoose.Schema({
    shipName:{type:String, require:true, unique:true},
    ownerId:{type: mongoose.Schema.ObjectId, ref: "User" },
    shipType:{type:String, require:true },
    shipReg:{type:String, require:true, unique:true},
    country:{type:String, require:true },
    isSchedule:{type:Boolean,default:false}
})
 
const Ship = mongoose.model("Ship",ship_schema);

module.exports=Ship;