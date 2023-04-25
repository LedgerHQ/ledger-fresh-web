import { Provider, number } from "starknet";
import type { NextApiRequest, NextApiResponse } from "next";

const GATEWAY_URL = process.env.GATEWAY_URL;
// NetworkName type is not exported
const NETWORK = process.env.NETWORK as any;

const provider = new Provider({
  sequencer: {
    network: NETWORK, // or 'goerli-alpha'
  },
});

export default async function getNonce(
  req: NextApiRequest,
  res: NextApiResponse<{ nonce: number.BigNumberish }>
) {
  const { address } = JSON.parse(req.body);
  const nonce = await provider.getNonceForAddress(address);
  return res.status(200).json({
    nonce,
  });
}
