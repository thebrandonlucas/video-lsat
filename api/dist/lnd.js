"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLnd = void 0;
const lightning_1 = require("lightning");
function getLnd(macaroon, socket) {
    const { lnd } = (0, lightning_1.authenticatedLndGrpc)({
        macaroon,
        socket,
    });
    return lnd;
}
exports.getLnd = getLnd;
//# sourceMappingURL=lnd.js.map