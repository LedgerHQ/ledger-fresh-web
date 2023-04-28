import {
  Abi,
  SequencerProvider,
  ec,
  Account,
  Contract,
  uint256,
  number,
} from "starknet";
import { constants } from "@/utils/constant";
import type { NextApiRequest, NextApiResponse } from "next";
import erc20Abi from "@/abis/ERC20.json";

const network: any = process.env.NETWORK || "goerli-alpha";
const DEPLOYER_ADDR =
  process.env.DEPLOYER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

const provider = new SequencerProvider({
  network,
});

export default async function deployAccount(
  req: NextApiRequest,
  res: NextApiResponse<{ transaction_hash: string }>
) {
  const deployerPK = "0";
  const devnetKeyPair = ec.getKeyPair(deployerPK);
  const deployerAccount = new Account(provider, DEPLOYER_ADDR, devnetKeyPair);
  const tokenContract = new Contract(
    erc20Abi as Abi,
    constants.ERC20.ETH.address,
    provider
  );
  tokenContract.connect(deployerAccount);
  const { address } = JSON.parse(req.body);

  const result = await tokenContract.balanceOf(address);

  if (!uint256.uint256ToBN(result.balance).eq(number.toBN(0))) {
    return res.status(400).json({
      transaction_hash: "account is funded",
    });
  }

  const response = await tokenContract.transfer(address, 10000000000000000);

  return res.status(200).json({
    transaction_hash: response.transaction_hash,
  });
}
