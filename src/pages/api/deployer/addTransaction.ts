import { number } from "starknet";
import type { NextApiRequest, NextApiResponse } from "next";

const GATEWAY_URL = process.env.GATEWAY_URL;

function bigNumberishArrayToDecimalStringArray(rawCalldata: any) {
  return rawCalldata.map((x: any) => number.toBN(x).toString(10));
}

export default async function addTransaction(
  req: NextApiRequest,
  res: NextApiResponse<{ transaction_hash: string }>
) {
  const { transactionsDetail, calldata, signature } = JSON.parse(req.body);
  const response = await fetch(`${GATEWAY_URL}/add_transaction`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "INVOKE_FUNCTION",
      sender_address: transactionsDetail.walletAddress,
      contract_address: transactionsDetail.contractAddress,
      calldata: bigNumberishArrayToDecimalStringArray(calldata ?? []),
      version: number.toHex(number.toBN(transactionsDetail.version || 1)),
      signature: bigNumberishArrayToDecimalStringArray(signature ?? []),
      nonce: number.toHex(number.toBN(transactionsDetail.nonce)),
      max_fee: number.toHex(number.toBN(transactionsDetail.maxFee || 0)),
    }),
  }).then((response) => response.json());
  return res.status(200).json({
    transaction_hash: response.transaction_hash,
  });
}
