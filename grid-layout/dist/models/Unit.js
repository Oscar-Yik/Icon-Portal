"use strict";
// models/Unit.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UnitSchema = new mongoose_1.default.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
});
exports.default = mongoose_1.default.model('unit', UnitSchema);
