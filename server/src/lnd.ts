import { AuthenticatedLnd, authenticatedLndGrpc } from "lightning";

export function getLnd(macaroon: string, socket: string) {
  const { lnd }: { lnd: AuthenticatedLnd } = authenticatedLndGrpc({
    macaroon,
    socket,
  });
  return lnd;
}
