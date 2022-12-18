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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lsat_js_1 = require("lsat-js");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const macaroon_js_1 = require("./macaroon.js");
const lightning_1 = require("lightning");
const aws_js_1 = require("./aws.js");
const video_js_1 = require("./db/video.js");
const lnd_js_1 = require("./lnd.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = process.env.PORT;
// todo: figure out thumbnail addition
const uploadVideo = (0, aws_js_1.s3Uploader)(process.env.VIDEO_BUCKET || "video-bucket");
app.get("/videos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield (0, video_js_1.getVideos)();
        res.send(data);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    }
}));
app.get("/video/:videoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // user tries to access a piece of content, server checks if they have paid for it
    // generate macaroon for user
    // 1 - get the payment hash and invoice
    // 2 - create lsat and send in header
    const { videoId } = req.params;
    if (!videoId) {
        res.status(404).send("Video id parameter missing");
        return;
    }
    const video = yield (0, video_js_1.getVideo)(videoId);
    if (!video) {
        res.status(404).send(`Video ID ${videoId} not found`);
        return;
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const lsat = lsat_js_1.Lsat.fromToken(authHeader);
        if (lsat.isExpired()) {
            console.error("LSAT is expired");
            res.send({ message: "lsat is expired" });
        }
        if (!lsat.isSatisfied()) {
            console.log("lsat is not satisfied with appropriate preimage");
            res.send({
                message: "lsat is not satisfied with appropriate preimage",
            });
        }
        // If the LSAT is satisfied and not expired, then they can view content
        try {
            const videoBase64 = yield (0, aws_js_1.getVideoFile)(video.video_id);
            res.json({
                message: "Successfully retrieved video",
                video_base64: videoBase64,
            });
            return;
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e });
        }
    }
    else {
        // connect to uploader's lnd and generate an invoice
        const lnd = yield (0, lnd_js_1.getLnd)(video.invoice_macaroon, video.api_host_port);
        try {
            const { id, request } = yield (0, lightning_1.createInvoice)({
                lnd,
                tokens: video.price_satoshi,
                description: `Video: ${video.video_name}`,
            });
            const macaroon = (0, macaroon_js_1.createMacaroon)(process.env.ROOT_KEY || "", id || "", 
            // todo: replace with url of resource
            req.get("host") || "");
            const lsat = lsat_js_1.Lsat.fromMacaroon((0, lsat_js_1.getRawMacaroon)(macaroon), request);
            const caveat = lsat_js_1.Caveat.decode(`video=${video.video_id}`);
            lsat.addFirstPartyCaveat(caveat);
            res.header("www-authenticate", lsat.toChallenge());
            // Don't send sensitive info to user, just necessary video info
            const { invoice_macaroon, api_host_port } = video, videoInfo = __rest(video, ["invoice_macaroon", "api_host_port"]);
            res.status(402).send({
                message: "Payment required",
                video: videoInfo,
            });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e });
        }
    }
}));
app.post("/checkpayment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payment_hash, video_id } = req.body;
        const video = yield (0, video_js_1.getVideo)(video_id);
        if (!video)
            throw "Video doesn't exist";
        const lnd = (0, lnd_js_1.getLnd)(video.invoice_macaroon, video.api_host_port);
        const { is_confirmed, secret } = yield (0, lightning_1.getInvoice)({
            id: payment_hash,
            lnd,
        });
        res.send({ is_confirmed, secret });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    }
}));
app.post("/upload", uploadVideo.single("video"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // todo: file type/size validation
    try {
        const url = `${req.protocol}://${req.get("host")}`;
        if (!req.file) {
            res
                .status(400)
                .json({ error: new Error("No file attached. Please attach a file.") });
            return;
        }
        // S3 calls the filename "key"
        // "any" should ideally not be used but "key" is not being recognized as a param on
        // multerS3 req.file object
        const { key: filename, originalname, size } = req.file;
        const { price, invoice_macaroon, api_host_port } = req.body;
        yield (0, video_js_1.addVideo)(filename, originalname, price, invoice_macaroon, api_host_port);
        res.status(201).send({ message: "success" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: e,
        });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map