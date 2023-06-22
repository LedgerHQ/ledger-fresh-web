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
import { getAccountAddress } from "./utils";
import { bnToCairoBN, parsePubKey } from "@/utils/webauthn";
import policy from "./policy.json";
// This file deploy a new account contract using the deployer already deployed on-chain
// The script will fail if you deploy two different contracts using the same pubKey (as it is used as a salt)

const NODE_ENV = process.env.NODE_ENV || "";
const CONTRACT_ACCOUNT_CLS_HASH = process.env.CONTRACT_ACCOUNT_CLS_HASH || "";
const PROXY_CLS_HASH = process.env.PROXY_CLS_HASH || "";
const WEBAUTHN_CLS_HASH = process.env.WEBAUTHN_CLS_HASH || "";
const network: any = process.env.NETWORK || "goerli-alpha";
const DEPLOYER_ADDR =
  process.env.DEPLOYER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

export const UDC = {
  ADDRESS: "0x02fc4b5482317aacb339ae5ee0b521ec4d1d28a5c608b04e7e7ccee443ccc016",
  ENTRYPOINT: "deployContract",
};

const provider = new SequencerProvider({
  network,
});

const ADD_POLICY_ENTRYPOINT = "set_policy";

const toCairoBool = (value: boolean): string => (+value).toString();

export default async function deployAccount(
  req: NextApiRequest,
  res: NextApiResponse<{ accountAddress: string; transaction_hash: string }>
) {
  const deployerPK = "0";
  const devnetKeyPair = ec.getKeyPair(deployerPK);
  const deployerAccount = new Account(provider, DEPLOYER_ADDR, devnetKeyPair);

  const pubKey = req.body;

  // const keypair = ec.genKeyPair();
  // const deviceKey = ec.getStarkKey(keypair);

  // note: Hard set, not used in fresh.
  const starkcheckKey =
    "0x33f45f07e1bd1a51b45fc24ec8c8c9908db9e42191be9e169bfcac0c0d99745";

  const { x, y } = parsePubKey(pubKey);

  const { x: x0, y: x1, z: x2 } = bnToCairoBN(number.toBN(x, 16));
  const { x: y0, y: y1, z: y2 } = bnToCairoBN(number.toBN(y, 16));

  const calldata = stark.compileCalldata({
    implementation: CONTRACT_ACCOUNT_CLS_HASH,
    selector: hash.getSelectorFromName("initialize"),
    calldata: stark.compileCalldata({
      plugin: WEBAUTHN_CLS_HASH,
      plugin_calldata: [x0, x1, x2, y0, y1, y2, starkcheckKey].map((x) =>
        x.toString()
      ),
    }),
  });

  if (NODE_ENV !== "development") {
    const response = {
      transaction_hash:
        "0x05c06f917736a0fbbf2615f0c30a50fa22c3cc42694eb47836f7bc9f541d8baa",
    };
    return res.status(200).json({
      transaction_hash: response.transaction_hash,
      accountAddress:
        "0x05bb8286aac5616e8d56edb0448649b73c1809e0d299cef941f87d748411b1fc",
    });
  } else {
    const accountAddress = getAccountAddress(pubKey, starkcheckKey);
    const response = await deployerAccount.execute([
      {
        contractAddress: UDC.ADDRESS,
        entrypoint: UDC.ENTRYPOINT,
        calldata: [
          PROXY_CLS_HASH,
          starkcheckKey,
          toCairoBool(true),
          calldata.length,
          ...calldata,
        ],
      },
      {
        contractAddress: accountAddress,
        entrypoint: ADD_POLICY_ENTRYPOINT,
        calldata: ["0x1", policy.length, ...policy],
      },
    ]);
    return res.status(200).json({
      transaction_hash: response.transaction_hash,
      accountAddress,
    });
  }
}
