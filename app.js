const express = require("express");
const userRouter = require("./routes/UserRoute");
const teamRouter = require("./routes/TeamRoute");
const app = express();
const cors = require("cors");
const menuRouter = require("./routes/MenuRoute");
const reservationRouter = require("./routes/ReservationRoute");
const couponRouter = require("./routes/CouponRoute");
const orderRouter = require('./routes/OrderRoutes')
const path = require("path");
// const corsOptions = {
//     origin: 'http://localhost:3000', // allow requests from this origin
//     optionsSuccessStatus: 200 // return 200 for preflight requests
//   };

//   app.use(cors(corsOptions)); // enable CORS with specific options

app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
//Static files:
app.use(express.static(path.join(__dirname, "build")));
// app.get('/', function(request, response){
//     response.sendFile(path.join(__dirname, 'build/index.html'));
// });


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

//APIs
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menu", menuRouter);
// app.use("/mails", mailer)
//Team Route
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/orders", orderRouter);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });


module.exports = app;
