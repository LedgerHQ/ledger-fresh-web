import {
  hash,
  SequencerProvider,
  ec,
  Account,
  stark,
  InvokeFunctionResponse,
  number,
} from "starknet";
import type { NextApiRequest, NextApiResponse } from "next";
import { split } from "./utils";

// This file deploy a new account contract using the deployer already deployed on-chain
// The script will fail if you deploy two different contracts using the same pubKey (as it is used as a salt)

const CONTRACT_ACCOUNT_CLS_HASH = process.env.CONTRACT_ACCOUNT_CLS_HASH || "";
const PROXY_CLS_HASH = process.env.PROXY_CLS_HASH || "";
const WEBAUTHN_CLS_HASH = process.env.WEBAUTHN_CLS_HASH || "";
const network: any = process.env.NETWORK || "goerli-alpha";
const deployerAddress =
  process.env.DEPLOYER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

export const UDC = {
  ADDRESS: "0x02fc4b5482317aacb339ae5ee0b521ec4d1d28a5c608b04e7e7ccee443ccc016",
  ENTRYPOINT: "deployContract",
};

const provider = new SequencerProvider({
  network,
});

const toCairoBool = (value: boolean): string => (+value).toString();

/**
 *  splitting a pubkey into an ECpoint.
 * @param pubkey prefixed PKCS11 key.
 * @returns ECpoint (x,y)
 */
const parsePubKey = (pubkey: string): { x: string; y: string } => {
  return {
    x: pubkey.slice(2, 66),
    y: pubkey.slice(66),
  };
};

export default async function deployAccount(
  req: NextApiRequest,
  res: NextApiResponse<InvokeFunctionResponse>
) {
  const deployerPK = "0";
  const devnetKeyPair = ec.getKeyPair(deployerPK);
  const deployerAccount = new Account(provider, deployerAddress, devnetKeyPair);

  const pubKey = req.body;

  const keypair = ec.genKeyPair();
  const deviceKey = ec.getStarkKey(keypair);

  const { x, y } = parsePubKey(pubKey);

  const { x: x0, y: x1, z: x2 } = split(number.toBN(x, 16));
  const { x: y0, y: y1, z: y2 } = split(number.toBN(y, 16));

  const calldata = stark.compileCalldata({
    implementation: CONTRACT_ACCOUNT_CLS_HASH,
    selector: hash.getSelectorFromName("initialize"),
    calldata: stark.compileCalldata({
      plugin: WEBAUTHN_CLS_HASH,
      plugin_calldata: [x0, x1, x2, y0, y1, y2, deviceKey].map((x) =>
        x.toString()
      ),
    }),
  });

  const transaction_hash = await deployerAccount.execute({
    contractAddress: UDC.ADDRESS,
    entrypoint: UDC.ENTRYPOINT,
    calldata: [
      PROXY_CLS_HASH,
      deviceKey,
      toCairoBool(true),
      calldata.length,
      ...calldata,
    ],
  });

  return res.status(200).json(transaction_hash);
}
