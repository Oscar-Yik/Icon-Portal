"use strict";
// app.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const themes_1 = __importDefault(require("./routes/api/themes"));
const s3_1 = __importDefault(require("./routes/api/s3"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/themes", themes_1.default);
app.use("/api/s3", s3_1.default);
// Connect Database
(0, db_1.default)();
app.get("/", (req, res) => res.send("Hello world!"));
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
