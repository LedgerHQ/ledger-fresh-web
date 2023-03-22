import clsx from "clsx";
import Image from "next/image";
import { ComponentProps, forwardRef, ReactNode } from "react";
import styles from "./WalletSelector.module.css";
import { useState, useEffect } from "react";

interface Props {}

export function WalletSelector({ ...props }: Props) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("walletName") || "placeholder";
    setUsername(name);
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
