// app.js

const express = require("express");
const connectDB = require("./config/db");
const themeRoutes = require("./routes/api/themes");
const s3Routes = require("./routes/api/s3");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express(); 

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/themes", themeRoutes);
app.use("/api/s3", s3Routes);

// Connect Database
connectDB(); 

app.get("/", (req, res) => res.send("Hello world!"));
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));