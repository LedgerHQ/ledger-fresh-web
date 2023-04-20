import { number, hash, stark } from "starknet";
import { bnToCairoBN, parsePubKey } from "@/utils/webauthn";
import * as BN from "bn.js";

const CONTRACT_ACCOUNT_CLS_HASH = process.env.CONTRACT_ACCOUNT_CLS_HASH || "";
const PROXY_CLS_HASH = process.env.PROXY_CLS_HASH || "";
const WEBAUTHN_CLS_HASH = process.env.WEBAUTHN_CLS_HASH || "";
const DEPLOYER_ADDR =
  process.env.DEPLOYER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

export const UDC = {
  ADDRESS: "0x02fc4b5482317aacb339ae5ee0b521ec4d1d28a5c608b04e7e7ccee443ccc016",
  ENTRYPOINT: "deployContract",
};

export function getAccountAddress(pubKey: string, deviceKey: string) {
  const { x, y } = parsePubKey(pubKey);

  const { x: x0, y: x1, z: x2 } = bnToCairoBN(number.toBN(x, 16));
  const { x: y0, y: y1, z: y2 } = bnToCairoBN(number.toBN(y, 16));
  const address = hash.calculateContractAddressFromHash(
    hash.pedersen([DEPLOYER_ADDR, deviceKey]),
    PROXY_CLS_HASH,
    stark.compileCalldata({
      implementation: CONTRACT_ACCOUNT_CLS_HASH,
      selector: hash.getSelectorFromName("initialize"),
      calldata: stark.compileCalldata({
        plugin: WEBAUTHN_CLS_HASH,
        plugin_calldata: [x0, x1, x2, y0, y1, y2, deviceKey].map((x) =>
          x.toString()
        ),
      }),
    }),
    UDC.ADDRESS
  );

  return address;
}
