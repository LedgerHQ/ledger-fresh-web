import Image from "next/image";
import styles from "./TokenList.module.css";
import { formatUnits } from "@/services/token/erc20";
import { BigNumberish } from "ethers";
import { TokenBagde } from "./TokenBadge";

interface Props {
  balance: BigNumberish;
  src: string;
  size: number;
  label: string;
}

export function TokenRow({ balance, src, size, label, ...props }: Props) {
  return (
    <div className={styles.row}>
      <TokenBagde label={label} src={src} size={size} />
      <p>{formatUnits(balance)}</p>
    </div>
  );
}
