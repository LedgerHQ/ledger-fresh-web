import Image from "next/image";
import styles from "./Header.module.css";
import { WalletSelector } from "@/components/WalletSelector";
import { useState, useEffect } from "react";
import { getSelectedAccount } from "@/services/accountStorage/account.storage";
import { useRouter } from "next/router";
import { useAccount } from "@/services/accountStorage/AccountContext";

interface Props {}

export function Header({}: Props) {
  const { selectedAccount } = useAccount();
  const router = useRouter();

  return (
    <div
      className={styles.header}
      onClick={() => {
        router.push("/");
      }}
    >
      <div className={styles.bg}></div>
      <div className={styles.bg2}></div>

      <WalletSelector />

      <div className={styles.actionRow}>
        <Image
          src="/Icons/copy.svg"
          alt="back"
          width={18}
          height={18}
          priority
          onClick={() => {
            navigator.clipboard.writeText(selectedAccount?.address || "");
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
