"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db.js
require('dotenv').config({ path: __dirname + "/../../.env" });
const mongoose_1 = __importDefault(require("mongoose"));
// const db =
//   `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@whatisacluster.n8fqxho.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=WhatIsACluster`;
const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.DEV_MONGODB_PASSWORD}@grid-data.qbo6wua.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=GridData`;
mongoose_1.default.set("strictQuery", true);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(db);
        console.log("MongoDB is Connected...");
    }
    catch (err) {
        if (err instanceof Error) {
            // If the error is an instance of the built-in Error class
            console.error("Error message:", err.message);
        }
        else {
            // For other types of errors (e.g., non-Error objects, strings, etc.)
            console.error("Unexpected error:", err);
        }
        process.exit(1);
    }
});
exports.default = connectDB;
