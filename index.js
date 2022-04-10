const express = require("express");
const app = express();
const cors = require("cors");
const transactionRouter = require("./routes/transactionRouter");

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "http://griph.xyz", credentials: true }));

app.use("/api/transactions", transactionRouter);

app.listen(PORT, () => {
  console.log(`Server listening on the port::${PORT}`);
});
