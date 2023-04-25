import Image from "next/image";
import styles from "./TokenList.module.css";
import { formatUnits } from "@/services/token/erc20";
import { BigNumberish } from "ethers";
import { TokenBadge } from "./TokenBadge";

interface Props {
  balance: BigNumberish;
  src: string;
  size: number;
  label: string;
}

export function TokenRow({ balance, src, size, label, ...props }: Props) {
  return (
    <div className={styles.row}>
      <TokenBadge label={label} src={src} size={size} />
      <p className={styles.value}>
        {formatUnits(balance).substring(
          0,
          formatUnits(balance).indexOf(".") + 6
        )}
      </p>
    </div>
  );
}
