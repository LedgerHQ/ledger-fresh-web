import { Contract, Provider, uint256, Abi, number } from "starknet";
import { constants } from "@/utils/constant";
import erc20Abi from "@/abis/ERC20.json";
import { ethers, BigNumberish } from "ethers";

const provider = new Provider({ sequencer: { network: "goerli-alpha" } });

export async function fetchBalance(address: string): Promise<BigNumberish> {
  const tokenContract = new Contract(
    erc20Abi as Abi,
    constants.ERC20.ETH.address,
    provider
  );
  const result = await tokenContract.balanceOf(address);
  return uint256.uint256ToBN(result.balance).toString();
}

export function formatUnits(amount: BigNumberish, decimals = 18): string {
  return ethers.formatUnits(amount, decimals);
}
