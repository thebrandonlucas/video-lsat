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
exports.getVideoFile = exports.uploadThumbnail = exports.s3Uploader = exports.s3Client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const config = {
    credentials: {
        accessKeyId: process.env.KEY_ID || "aws-access-key-id",
        secretAccessKey: process.env.SECRET_KEY || "aws-secret-access-key",
    },
    region: process.env.REGION,
};
exports.s3Client = new client_s3_1.S3Client(config);
// Create an uploader to a specific bucket
function s3Uploader(bucket) {
    return (0, multer_1.default)({
        storage: (0, multer_s3_1.default)({
            s3: exports.s3Client,
            bucket: bucket,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const fileName = file.originalname.toLowerCase().split(" ").join("-");
                cb(null, (0, uuid_1.v4)() + "-" + fileName);
            },
        }),
    });
}
exports.s3Uploader = s3Uploader;
function uploadThumbnail(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: process.env.VIDEO_BUCKET,
            Key: filename,
            Body: data,
        };
        exports.s3Client.send(new client_s3_1.PutObjectCommand(params));
    });
}
exports.uploadThumbnail = uploadThumbnail;
function getVideoFile(videoId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: process.env.VIDEO_BUCKET,
            Key: videoId,
        };
        try {
            // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
            const data = yield exports.s3Client.send(new client_s3_1.GetObjectCommand(params));
            // Convert the ReadableStream to a string.
            return (_a = data.Body) === null || _a === void 0 ? void 0 : _a.transformToString("base64");
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getVideoFile = getVideoFile;
//# sourceMappingURL=aws.js.map