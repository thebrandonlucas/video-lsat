import { Identifier } from "lsat-js";

import * as Macaroon from "macaroon";

export function createMacaroon(
  signingKey: string,
  paymentHash: string,
  location: string,
  version: number = 1
) {
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
