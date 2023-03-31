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
import { split, parsePubKey, getAccountAddress } from "./utils";

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
  const deviceKey =
    "0x3a85192c373a2a026412b7412a3b45915a529b6d8bc5dfe5a30b7d1f2504917";

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

  if (NODE_ENV == "development") {
    const response = {
      transaction_hash:
        "0x0322dfe01abf27e2cef2d034873975daf5f0e83660aabacdbb98c52fe0588124",
    };
    return res.status(200).json({
      transaction_hash: response.transaction_hash,
      accountAddress:
        "0x04fe82a3e91503976018339cbdf42737f367a1a531dead38072c8e0b44e1db17",
    });
  } else {
    const response = await deployerAccount.execute({
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
    const accountAddress = getAccountAddress(pubKey, deviceKey);
    return res.status(200).json({
      transaction_hash: response.transaction_hash,
      accountAddress,
    });
  }
}
