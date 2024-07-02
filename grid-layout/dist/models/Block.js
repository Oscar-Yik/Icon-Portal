"use strict";
// models/Block.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BlockSchema = new mongoose_1.default.Schema({
    data_grid: {
        i: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        w: { type: Number, required: true },
        h: { type: Number, required: true },
        isBounded: { type: Boolean, required: true },
        isResizable: { type: Boolean, required: true }
    },
    link: { type: String, required: true },
    img_url: { type: String, required: true }
});
exports.default = mongoose_1.default.model('block', BlockSchema);
