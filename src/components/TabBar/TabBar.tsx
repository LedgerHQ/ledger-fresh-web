import {
  getTransactions,
  Transaction,
  hideLastTransaction,
} from "@/services/transactionStorage/transaction.storage";
import React, { useState, useEffect } from "react";
import styles from "./TabBar.module.css";
import Image from "next/image";
import clsx from "clsx";

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
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [notification, setNotification] = useState<Transaction>();

  function hideNotification() {
    if (!notification) return;
    setNotification({
      ...notification,
      hidden: !notification.hidden,
    });
    hideLastTransaction();
  }

  useEffect(() => {
    const transactions = getTransactions();
    setNotification(transactions[transactions.length - 1]);
  }, []);

  return (
    <div>
      {notification && !notification.hidden ? (
        <div className={styles.notification}>
          <div
            className={styles.notificationLeft}
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
            <p className={styles.address}>{`${notification.data[2]}`}</p>
          </div>
          <Image
            src="/Icons/cross-23.svg"
            alt="back"
            width={20}
            height={20}
            onClick={() => hideNotification()}
            priority
          />
        </div>
      ) : null}
      <div
        className={clsx(
          styles.tabbar,
          notification && !notification.hidden && styles.notificationBorder
        )}
      >
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
