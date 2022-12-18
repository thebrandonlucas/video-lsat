"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyOrRows = exports.getOffset = void 0;
function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * listPerPage;
}
exports.getOffset = getOffset;
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}
exports.emptyOrRows = emptyOrRows;
//# sourceMappingURL=helper.js.map