import Image from "next/image";
import styles from "./TokenList.module.css";
import { formatUnits } from "@/services/token/erc20";
import { BigNumberish } from "ethers";

interface Props {
  balance: BigNumberish;
}

export function TokenRow({ balance, ...props }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.icon}>
          <Image
            src="/Icons/ETH.svg"
            alt="back"
            width={20}
            height={20}
            priority
          />
        </div>
        <p>Ethereum: </p>
      </div>
      <p>{formatUnits(balance)}</p>
    </div>
  );
}
