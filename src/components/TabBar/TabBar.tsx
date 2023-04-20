import {
  getTransactions,
  Transaction,
} from "@/services/transactionStorage/transaction.storage";
import React, { useState, useEffect } from "react";
import styles from "./TabBar.module.css";
import Image from "next/image";

export type Props = React.PropsWithChildren<{
  /**
   * An optional callback that will be called when the active tab changes.
   */
  onTabChange?: (activeIndex: number) => void;
  /**
   * The tab index to mark as active when rendering for the first time.
   * If omitted, then initially no tabs will be selected.
   */
  initialActiveIndex?: number;
}>;

function openStarkScan(hash: string) {
  window.open(
    `https://testnet.starkscan.co/tx/${hash}`,
    "_blank",
    "noreferrer"
  );
}

export default function TabBar({
  children,
  onTabChange,
  initialActiveIndex,
}: Props): JSX.Element {
  useEffect(() => {
    const transaction = getTransactions();
    setNotification(transaction[0]);
  }, []);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [notification, setNotification] = useState<Transaction>();
  return (
    <div>
      {notification ? (
        <div
          className={styles.notification}
          onClick={() => openStarkScan(notification.hash)}
        >
          <Image
            src="/Icons/ellipse11.svg"
            alt="back"
            width={20}
            height={20}
            priority
          />
          <p>{`Sending ${notification.data[1]} ${notification.data[0]} to`}</p>
          <p className={styles.address}>{`${notification.hash}`}</p>
        </div>
      ) : null}
      <div className={styles.tabbar}>
        {React.Children.toArray(children).map((child, index) => (
          <div
            className={styles.item}
            key={index}
            data-active={index === activeIndex}
            onClick={() => {
              setActiveIndex(index);
              onTabChange && onTabChange(index);
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
