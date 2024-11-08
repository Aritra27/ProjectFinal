const mongoose= require('mongoose')
const URI = process.env.MONGOOSE_URI;
const connect_db=async()=>{
    try {
        await mongoose.connect(URI);
        console.log("data base connection successful")
    } catch (error) {
        console.log("data base connection problem "+error)
    }
}
module.exports=connect_db;