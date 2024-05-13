// app.js

const express = require("express");
const connectDB = require("./config/db");
const blockRoutes = require("./routes/api/blocks");
const thingRoutes = require("./routes/api/things");
const themeRoutes = require("./routes/api/themes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for the /api/blocks path
app.use("/api/blocks", blockRoutes);
app.use("/api/things", thingRoutes);
app.use("/api/themes", themeRoutes);

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Hello world!"));
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));