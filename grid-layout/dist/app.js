"use strict";
// app.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const blocks_1 = __importDefault(require("./routes/api/blocks"));
const units_1 = __importDefault(require("./routes/api/units"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// for the /api/blocks path
app.use("/api/blocks", blocks_1.default);
app.use("/api/units", units_1.default);
// Connect Database
(0, db_1.default)();
app.get("/", (req, res) => res.send("Hello world!"));
const port = process.env.PORT || 8092;
app.listen(port, () => console.log(`Server running on port ${port}`));
