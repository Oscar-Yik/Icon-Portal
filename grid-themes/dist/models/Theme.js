"use strict";
// models/Theme.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ThemeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    block: { type: String, required: true },
    header: { type: String, required: true },
    headerButton: { type: String, required: true },
    headerFont: { type: String, required: true },
    grid: { type: String, required: true },
    editBox: { type: String, required: true },
    editBoxFont: { type: String, required: true },
    backImg: { type: String, required: true }
});
exports.default = mongoose_1.default.model('theme', ThemeSchema);
