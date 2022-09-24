const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const transactionRouter = require("./routes/transactionRouter");
const userRouter = require("./routes/userRouter");
const vendorRouter = require("./routes/vendorRouter");
const hangoutsRouter = require("./routes/hangoutsRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const authenticationRouter = require("./routes/authenticationRouter");

require("dotenv").config();

const PORT = process.env.PORT || '23.90.200.170';

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());

app.use("/api/transactions", transactionRouter);
app.use("/api/users", userRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/hangouts", hangoutsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/authentication", authenticationRouter);


app.listen(PORT, () => {
  console.log(`Server listening on the port::${PORT}`);
});
