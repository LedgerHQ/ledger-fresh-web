import Image from "next/image";
import styles from "./Header.module.css";
import { WalletSelector } from "@/components/WalletSelector";

interface Props {}

export function Header({}: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.bg}></div>
      <div className={styles.bg2}></div>
      <div className={styles.wrapper}>
        <div className={styles.thumbnail} />
        <WalletSelector />
      </div>
      <div className={styles.actionRow}>
        <Image
          src="/Icons/copy.svg"
          alt="back"
          width={14}
          height={14}
          priority
        />
        <Image
          src="/Icons/qr-code.svg"
          alt="back"
          width={14}
          height={14}
          priority
        />
        <Image
          src="/Icons/settings.svg"
          alt="back"
          width={14}
          height={14}
          priority
        />
      </div>
    </div>
  );
}
