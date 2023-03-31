import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ComponentProps, forwardRef, ReactNode } from "react";
import styles from "./Header.module.css";
import { WalletSelector } from "@/components/WalletSelector";

interface Props {}

export function Header({ ...props }: Props) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("walletName") || "placeholder";
    setUsername(name);
  }, []);

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
