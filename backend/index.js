const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

//controller exports
const user_router = require("./routes/user.route");
const ship_router = require("./routes/ship.route");
const port_router = require("./routes/port.route");
const schedule_router = require("./routes/schedule.route");
//database export
const db = require("./utils/db");


const corsOption={
  origin:"http://localhost:5173",
  credentials: true  
}
app.use(cors(corsOption));

//all middleware

//all routing
app.use("/api/v1/user",user_router)
app.use("/api/v1/ship",ship_router)
app.use("/api/v1/port",port_router)
app.use("/api/v1/schedule",schedule_router)

const PORT = process.env.PORT;




db().then(
  app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
  })
);

