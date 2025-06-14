const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//controller exports
const user_router = require("./routes/user.route");
const ship_router = require("./routes/ship.route");
const port_router = require("./routes/port.route");
const schedule_router = require("./routes/schedule.route");
const messageRoute= require('./routes/message.route')
const {app,server}= require('./socket/socket')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))


//database export
const db = require("./utils/db");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/errorMiddleware");


const corsOption={
  origin:"http://localhost:5173",
  credentials: true  
}
app.use(cors(corsOption));

app.use(morgan('dev'));

//all middleware

//all routing
app.use("/api/v1/user",user_router)
app.use("/api/v1/ship",ship_router)
app.use("/api/v1/port",port_router)
app.use("/api/v1/schedule",schedule_router)
app.use('/api/v1/message', messageRoute);

app.use(errorMiddleware)

const PORT = process.env.PORT;




db().then(
  server.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
  })
);

