// app.js

import express from "express";
import connectDB from "./config/db";
import themeRoutes from "./routes/api/themes";
import s3Routes from "./routes/api/s3";
import cors from "cors";
import bodyParser from "body-parser";

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