import {
  getTransactions,
  Transaction,
  hideLastTransaction,
} from "@/services/transactionStorage/transaction.storage";
import React, { useState, useEffect } from "react";
import styles from "./Notification.module.css";
import Image from "next/image";

function openStarkScan(hash: string) {
  window.open(
    `https://testnet.starkscan.co/tx/${hash}`,
    "_blank",
    "noreferrer"
  );
}

export function Notification({}): JSX.Element {
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

  if (!notification || notification?.hidden) return <div />;

  const type = () => {
    switch (notification.type) {
      case 1:
        return (
          <div className={styles.type}>
            <p>{`Deploying your contract: `}</p>
            <p className={styles.address}>{`${notification.data[2]}`}</p>
          </div>
        );

      case 20:
        return (
          <div className={styles.type}>
            <p>{`Sending ${notification.data[1]} ${notification.data[0]} to`}</p>
            <p className={styles.address}>{`${notification.data[2]}`}</p>
          </div>
        );
      case 21:
        return (
          <div className={styles.type}>
            <p>{`Receiving 0,01 eth from faucet: `}</p>
            <p className={styles.address}>{`${notification.hash}`}</p>
          </div>
        );

      case 99:
        return (
          <div className={styles.type}>
            <p>{`Faucet: account already funded `}</p>
          </div>
        );

      default:
        return <h1>No notification type found</h1>;
    }
  };

  return (
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

        {type()}
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
  );
}
