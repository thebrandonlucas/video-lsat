import { Caveat, getRawMacaroon, Lsat } from "lsat-js";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createMacaroon } from "./macaroon.js";
import { createInvoice, getInvoice } from "lightning";
import { s3Uploader, getVideoFile } from "./aws.js";
import { addVideo, getVideo, getVideos } from "./db/video.js";
import { getLnd } from "./lnd.js";

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT;

// todo: figure out thumbnail addition
const uploadVideo = s3Uploader(process.env.VIDEO_BUCKET || "video-bucket");

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const { data } = await getVideos();
    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

app.get("/video/:videoId", async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    res.status(404).send("Video id parameter missing");
    return;
  }
  const video = await getVideo(videoId);
  if (!video) {
    res.status(404).send(`Video ID ${videoId} not found`);
    return;
  }
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const lsat = Lsat.fromToken(authHeader);
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
      const videoBase64 = await getVideoFile(video.video_id);
      res.json({
        message: "Successfully retrieved video",
        video_base64: videoBase64,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  } else {
    // connect to uploader's lnd and generate an invoice
    const lnd = await getLnd(video.invoice_macaroon, video.api_host_port);
    try {
      const { id, request } = await createInvoice({
        lnd,
        tokens: video.price_satoshi,
        description: `Video: ${video.video_name}`,
      });
      const macaroon = createMacaroon(
        process.env.ROOT_KEY || "",
        id || "",
        // todo: replace with url of resource
        req.get("host") || ""
      );
      const lsat = Lsat.fromMacaroon(getRawMacaroon(macaroon), request);
      const caveat = Caveat.decode(`video=${video.video_id}`);
      lsat.addFirstPartyCaveat(caveat);
      res.header("www-authenticate", lsat.toChallenge());
      // Don't send sensitive info to user, just necessary video info
      const { invoice_macaroon, api_host_port, ...videoInfo } = video;
      res.status(402).send({
        message: "Payment required",
        video: videoInfo,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  }
});

app.post("/checkpayment", async (req: Request, res: Response) => {
  try {
    const { payment_hash, video_id } = req.body;
    const video = await getVideo(video_id);
    if (!video) throw "Video doesn't exist";
    const lnd = getLnd(video.invoice_macaroon, video.api_host_port);

    const { is_confirmed, secret } = await getInvoice({
      id: payment_hash,
      lnd,
    });
    res.send({ is_confirmed, secret });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

app.post("/upload", uploadVideo.single("video"), async (req, res) => {
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
    const { key: filename, originalname, size } = req.file as any;
    const { price, invoice_macaroon, api_host_port } = req.body;

    await addVideo(
      filename,
      originalname,
      price,
      invoice_macaroon,
      api_host_port
    );
    res.status(201).send({ message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e,
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Export API for Vercel build process
module.exports = app;
