const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const transactionRouter = require("./routes/transactionRouter");
const userRouter = require("./routes/userRouter");
const vendorRouter = require("./routes/vendorRouter");

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());

app.use("/api/transactions", transactionRouter);
app.use("/api/users", userRouter);
app.use("/api/vendors", vendorRouter);


app.listen(PORT, () => {
  console.log(`Server listening on the port::${PORT}`);
});
