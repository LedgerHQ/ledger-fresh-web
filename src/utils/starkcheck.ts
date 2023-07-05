import {
  Call,
  InvocationsSignerDetails,
  Signature,
  transaction,
  number,
} from "starknet";

const STARKCHECK_ENDPOINT = process.env.NEXT_PUBLIC_STARKCHECK_API_ENDPOINT!;

type ExtendedInvocationsSignerDetails = InvocationsSignerDetails & {
  type: string; // replace 'YourType' with the actual type of the 'type' field
};

export async function starkCheck(
  calls: Call[],
  transactionsDetail: ExtendedInvocationsSignerDetails,
  signer: string
): Promise<Signature> {
  const calldata = transaction.fromCallsToExecuteCalldata(calls);

  const response = await fetch(`${STARKCHECK_ENDPOINT}/starkchecks/verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      signer,
      transaction: {
        contractAddress: transactionsDetail.walletAddress,
        nonce: number.toHex(number.toBN(transactionsDetail.nonce)),
        calldata,
        version: "1",
        signature: [],
        type: transactionsDetail.type || "INVOKE_FUNCTION",
        maxFee: number.toHex(number.toBN(transactionsDetail.maxFee || 0)),
      },
    }),
  }).then((response) => response.json());
  console.log("response starkcheck");
  console.log(response);
  // message indicates errors
  if (response.message) {
    throw response.message;
  }
  return response.signature;
}
