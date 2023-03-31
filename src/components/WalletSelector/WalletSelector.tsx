import Image from "next/image";
import styles from "./WalletSelector.module.css";
import { useState, useEffect } from "react";
import { getAccounts } from "@/services/accountStorage/account.storage";

interface Props {}

export function WalletSelector({ ...props }: Props) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const accounts = getAccounts();
    accounts.length ? setUsername(accounts[0].name) : setUsername("No_account");
  }, []);

  return (
    <div className={styles.dropdown}>
      {username}
      <Image
        src="/Icons/chevron-old-down.svg"
        alt="back"
        width={14}
        height={14}
        priority
      />
    </div>
  );
}
