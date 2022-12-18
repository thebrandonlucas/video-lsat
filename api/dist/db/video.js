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
exports.addVideo = exports.getVideo = exports.videoExists = exports.getVideos = void 0;
const query_js_1 = __importDefault(require("./query.js"));
const helper_js_1 = require("./helper.js");
const config_js_1 = __importDefault(require("./config.js"));
function getVideos(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const offset = (0, helper_js_1.getOffset)(page, config_js_1.default.listPerPage);
        const rows = yield (0, query_js_1.default)("SELECT video_id, video_name, price_satoshi, created_at FROM videos OFFSET $1 LIMIT $2", [offset, config_js_1.default.listPerPage]);
        const data = (0, helper_js_1.emptyOrRows)(rows);
        const meta = { page };
        return {
            data,
            meta,
        };
    });
}
exports.getVideos = getVideos;
function videoExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, query_js_1.default)("SELECT (EXISTS (SELECT 1 FROM videos WHERE video_id = $1", [id]);
        const data = (0, helper_js_1.emptyOrRows)(result);
        if (!data.length)
            return false;
        const exists = data[0];
        return exists;
    });
}
exports.videoExists = videoExists;
function getVideo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, query_js_1.default)(`SELECT video_id, video_name, price_satoshi, invoice_macaroon, api_host_port, created_at FROM videos WHERE video_id = $1`, [id]);
        const data = (0, helper_js_1.emptyOrRows)(result);
        if (data.length === 0) {
            console.error(`Requested video ${id} does not exist`);
            return false;
        }
        const video = data[0];
        return video;
    });
}
exports.getVideo = getVideo;
function addVideo(videoId, videoName, priceSatoshi, invoiceMacaroon, apiHostPort) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, query_js_1.default)("INSERT INTO videos (video_id, video_name, price_satoshi, invoice_macaroon, api_host_port) VALUES ($1, $2, $3, $4, $5)", [videoId, videoName, priceSatoshi, invoiceMacaroon, apiHostPort]);
    });
}
exports.addVideo = addVideo;
//# sourceMappingURL=video.js.map