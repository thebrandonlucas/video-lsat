"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMacaroon = void 0;
const { Identifier } = require("lsat-js");
const Macaroon = require("macaroon");
function createMacaroon(signingKey, paymentHash, location, version = 1) {
    const identifier = new Identifier({
        paymentHash: Buffer.from(paymentHash, "hex"),
    });
    return Macaroon.newMacaroon({
        version,
        rootKey: signingKey,
        identifier: identifier.toString(),
        location,
    });
}
exports.createMacaroon = createMacaroon;
//# sourceMappingURL=macaroon.js.map