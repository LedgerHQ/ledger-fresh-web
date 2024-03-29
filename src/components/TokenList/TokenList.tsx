import styles from "./TokenList.module.css";
import { useState, useEffect } from "react";
import { WalletAccount } from "@/services/accountStorage/account.storage";
import { fetchBalance, formatUnits } from "@/services/token/erc20";
import { BigNumberish } from "ethers";
import { TokenRow } from "./TokenRow";

interface Props {
  account: WalletAccount;
}

export function TokenList({ account, ...props }: Props) {
  const [balance, setBalance] = useState<BigNumberish>(0);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await fetchBalance(account.address);
      setBalance(balance);
    };
    getBalance().catch(console.error);
  }, [account]);

  return (
    <div className={styles.list}>
      <h2 className={styles.title}> Your funds </h2>
      <TokenRow
        balance={balance}
        label="Ethereum"
        src="/Icons/ETH.svg"
        size={20}
      />
    </div>
  );
}
