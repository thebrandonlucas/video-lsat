import query from "./query.js";
import { getOffset, emptyOrRows } from "./helper.js";
import config from "./config.js";
import { DBVideo } from "../types/types.js";

export async function getVideos(page = 1) {
  const offset = getOffset(page, config.listPerPage);
  const rows = await query(
    "SELECT video_id, video_name, price_satoshi, created_at FROM videos ORDER BY created_at DESC OFFSET $1 LIMIT $2",
    [offset, config.listPerPage]
  );
  const data: DBVideo[] = emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

export async function videoExists(id: string) {
  const result = await query(
    "SELECT (EXISTS (SELECT 1 FROM videos WHERE video_id = $1",
    [id]
  );
  const data: boolean[] = emptyOrRows(result);
  if (!data.length) return false;
  const exists = data[0];

  return exists;
}

export async function getVideo(id: string) {
  const result = await query(
    `SELECT video_id, video_name, price_satoshi, invoice_macaroon, api_host_port, created_at FROM videos WHERE video_id = $1`,
    [id]
  );

  const data: DBVideo[] = emptyOrRows(result);
  if (data.length === 0) {
    console.error(`Requested video ${id} does not exist`);
    return false;
  }
  const video = data[0];
  return video;
}

export async function addVideo(
  videoId: string,
  videoName: string,
  priceSatoshi: number,
  invoiceMacaroon: string,
  apiHostPort: string
) {
  await query(
    "INSERT INTO videos (video_id, video_name, price_satoshi, invoice_macaroon, api_host_port) VALUES ($1, $2, $3, $4, $5)",
    [videoId, videoName, priceSatoshi, invoiceMacaroon, apiHostPort]
  );
}
