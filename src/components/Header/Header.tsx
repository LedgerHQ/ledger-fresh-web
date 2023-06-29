import Image from "next/image";
import styles from "./Header.module.css";
import { WalletSelector } from "@/components/WalletSelector";
import { useState, useEffect } from "react";
import { getAccounts } from "@/services/accountStorage/account.storage";
import { useRouter } from "next/router";

interface Props {}

export function Header({}: Props) {
  const [address, setAddress] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const accounts = getAccounts();
    accounts.length
      ? setAddress(accounts[0].address)
      : setAddress("No_account");
  }, []);
  return (
    <div
      className={styles.header}
      onClick={() => {
        router.push("/");
      }}
    >
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
          width={18}
          height={18}
          priority
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
          className={styles.copyIcon}
        />
        <Image
          src="/Icons/qr-code.svg"
          alt="back"
          width={18}
          height={18}
          priority
        />
        <Image
          src="/Icons/settings.svg"
          alt="back"
          width={18}
          height={18}
          priority
          className={styles.copyIcon}
          onClick={() => {
            router.push("/settings");
          }}
        />
      </div>
    </div>
  );
}
