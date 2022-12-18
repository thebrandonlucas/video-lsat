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
const pg_1 = __importDefault(require("pg"));
const config_js_1 = __importDefault(require("./config.js"));
const { Pool } = pg_1.default;
const pool = new Pool(config_js_1.default.db);
// node-postgres tutorial from: https://geshan.com.np/blog/2021/01/nodejs-postgresql-tutorial/
/**
 * Query the database using the pool
 * @param {*} query
 * @param {*} params
 *
 * @see https://node-postgres.com/features/pooling#single-query
 */
function query(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool.query(query, params);
        return rows;
    });
}
exports.default = query;
//# sourceMappingURL=query.js.map