import {
  hash,
  SequencerProvider,
  ec,
  Account,
  stark,
  InvokeFunctionResponse,
} from "starknet";
import type { NextApiRequest, NextApiResponse } from "next";

// This file deploy a new account contract using the deployer already deployed on-chain
// The script will fail if you deploy two different contracts using the same pubKey (as it is used as a salt)

const CONTRACT_ACCOUNT_CLS_HASH = process.env.CONTRACT_ACCOUNT_CLS_HASH || "";
const PROXY_CLS_HASH = process.env.PROXY_CLS_HASH || "";
const STARKSIGNER_CLS_HASH = process.env.STARKSIGNER_CLS_HASH || "";
const network: any = process.env.NETWORK || "goerli-alpha";
const deployerAddress =
  process.env.DEPLOYER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

export const UDC = {
  ADDRESS: "0x02fc4b5482317aacb339ae5ee0b521ec4d1d28a5c608b04e7e7ccee443ccc016",
  ENTRYPOINT: "deployContract",
};

const toCairoBool = (value: boolean): string => (+value).toString();

const sanitize0x = (pubkey: string): string => {
  console.log("pubkey");
  console.log(pubkey);
  return `0x${pubkey}`;
};

export default async function deployAccount(
  req: NextApiRequest,
  res: NextApiResponse<InvokeFunctionResponse>
) {
  const starkPub = JSON.parse(req.body).pubKey;
  console.log(req.body);
  const provider = new SequencerProvider({
    network,
  });
  const deployerPK = "0";

  const devnetKeyPair = ec.getKeyPair(deployerPK);
  const deployerAccount = new Account(provider, deployerAddress, devnetKeyPair);

  console.log(STARKSIGNER_CLS_HASH);
  console.log(PROXY_CLS_HASH);
  console.log(deployerAddress);
  console.log(UDC);

  const calldata = stark.compileCalldata({
    implementation: CONTRACT_ACCOUNT_CLS_HASH,
    selector: hash.getSelectorFromName("initialize"),
    calldata: stark.compileCalldata({
      plugin: STARKSIGNER_CLS_HASH,
      plugin_calldata: stark.compileCalldata({
        signer: sanitize0x(starkPub),
      }),
    }),
  });

  console.log(calldata);

  const transaction_hash = await deployerAccount.execute({
    contractAddress: UDC.ADDRESS,
    entrypoint: UDC.ENTRYPOINT,
    calldata: [
      PROXY_CLS_HASH,
      sanitize0x(starkPub),
      toCairoBool(true),
      calldata.length,
      ...calldata,
    ],
  });

  // @TODO save in txHash storage
  console.log(transaction_hash);
  return res.status(200).send(transaction_hash);
}
