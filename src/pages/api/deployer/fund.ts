import {
  Abi,
  SequencerProvider,
  ec,
  Account,
  Contract,
  uint256,
  stark,
  number,
} from "starknet";
import { constants } from "@/utils/constant";
import type { NextApiRequest, NextApiResponse } from "next";
import erc20Abi from "@/abis/ERC20.json";
import { parseUnits } from "ethers";

const network: any = process.env.NETWORK || "goerli-alpha";
const FUNDER_ADDR =
  process.env.FUNDER_ADDR ||
  "0x021279121162867143b675bbce20b4010099842d31138eeaafcfcfea4afb596d";

const provider = new SequencerProvider({
  network,
});

export default async function fundAccount(
  req: NextApiRequest,
  res: NextApiResponse<{ transaction_hash: string }>
) {
  const deployerPK = "0";
  const devnetKeyPair = ec.getKeyPair(deployerPK);
  const deployerAccount = new Account(provider, FUNDER_ADDR, devnetKeyPair);
  const tokenContract = new Contract(
    erc20Abi as Abi,
    constants.ERC20.ETH.address,
    provider
  );
  // tokenContract.connect(deployerAccount);
  const { address } = JSON.parse(req.body);

  const result = await tokenContract.balanceOf(address);

  if (!uint256.uint256ToBN(result.balance).eq(number.toBN(0))) {
    return res.status(400).json({
      transaction_hash: "account is funded",
    });
  }

  const { low, high }: any = uint256.bnToUint256(
    parseUnits("10000000000000000", "wei").toString()
  );
  const transferCallData = stark.compileCalldata({
    recipient: address,
    low,
    high,
  });

  const { transaction_hash: transaction_hash } = await deployerAccount.execute({
    contractAddress: constants.ERC20.ETH.address,
    entrypoint: "transfer",
    calldata: transferCallData,
  });
  return res.status(200).json({
    transaction_hash,
  });
}
