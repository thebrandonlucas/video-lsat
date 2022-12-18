"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePreimage = void 0;
const crypto_1 = __importDefault(require("crypto"));
function validatePreimage(preimage, paymentHash) {
    const hash = crypto_1.default.createHash("sha256").update(preimage).digest("hex");
    return hash === paymentHash;
}
exports.validatePreimage = validatePreimage;
//# sourceMappingURL=lsat.js.map