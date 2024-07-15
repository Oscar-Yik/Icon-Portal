// app.js

import express from "express";
import blockRoutes from "./routes/api/block_route";
import unitRoutes from "./routes/api/unit_route";
import cors from "cors";
import bodyParser from "body-parser";
import { Database } from "../layout-types";
export default function (database: Database) {
    const app = express();

    app.use(cors({ origin: true, credentials: true }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Connect Database
    database.connectToDatabase();

    // for the /api/blocks path
    app.use("/api/blocks", blockRoutes(database));
    app.use("/api/units", unitRoutes(database));

    return app;
}