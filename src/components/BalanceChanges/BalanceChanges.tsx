import React from "react";
import styles from "./BalanceChanges.module.css";

interface BalanceChange {
  sender: string;
  receiver: string;
  amount: string;
  contractAddress: string;
  symbol: string;
  type: string;
  name: string;
  decimals: number;
}

interface BalanceChangesListProps {
  accountAddress: string;
  changes: BalanceChange[];
}

export const BalanceChangesList: React.FC<BalanceChangesListProps> = ({
  accountAddress,
  changes,
}) => {
  const handleAmountColor = (change: BalanceChange): string =>
    change.sender === accountAddress ? styles.red : styles.green;

  const handleAmountConversion = (change: BalanceChange): string =>
    change.type === "ERC20"
      ? (parseInt(change.amount) / 10 ** change.decimals).toString().slice(0, 8)
      : "";

  const handleAmountPrefix = (change: BalanceChange): string =>
    change.receiver === accountAddress ? "+" : "-";

  return (
    <div className={styles.balanceChangesList}>
      <h4>Estimated Balance changes</h4>
      {changes.map((change, index) => (
        <div key={index} className={styles.balanceChange}>
          <div className={styles.tokenName}>{change.name}</div>
          {change.type === "ERC20" && (
            <div className={`${styles.amount} ${handleAmountColor(change)}`}>
              {handleAmountPrefix(change)}
              {handleAmountConversion(change)} {change.symbol}
            </div>
          )}
          {change.type === "NFT" && (
            <div className={`${styles.amount} ${handleAmountColor(change)}`}>
              {handleAmountPrefix(change)}1 NFT {change.symbol}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
