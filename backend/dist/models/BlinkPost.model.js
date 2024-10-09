"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const blinkPostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    premiumTitle: { type: String, required: true },
    premiumContent: { type: String, required: true },
    premiumImage: { type: String, required: true },
    type: { type: String, enum: ['ppv', 'subscription'], required: true },
    revenue: { type: Number, default: 0 },
    creator: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Creator', required: true },
    subscribers: { type: [String], required: true, default: [] },
    impressionCount: { type: Number, default: 0 },
    engagementCount: { type: Number, default: 0 },
    paymentCount: { type: Number, default: 0 },
}, { timestamps: true });
const BlinkPost = mongoose_1.default.model('BlinkPost', blinkPostSchema);
exports.default = BlinkPost;