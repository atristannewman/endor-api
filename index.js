const express = require("express");
const app = express();
const cors = require("cors");
const transactionRouter = require("./routes/transactionRouter");
const userRouter = require("./routes/userRouter");
const whitelistDomain = ["http://griph.xyz"];
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: whitelistDomain, credentials: true }));

app.use("/api/transactions", transactionRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server listening on the port::${PORT}`);
});
