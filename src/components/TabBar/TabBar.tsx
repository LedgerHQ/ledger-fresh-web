import {
  getTransactions,
  Transaction,
  hideLastTransaction,
} from "@/services/transactionStorage/transaction.storage";
import React, { useState, useEffect } from "react";
import styles from "./TabBar.module.css";
import { useNotificationContext } from "@/services/notificationProvider";
import clsx from "clsx";
import { Notification } from "@/components/Notification";

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

export default function TabBar({
  children,
  onTabChange,
  initialActiveIndex,
}: Props): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const { notification } = useNotificationContext();
  return (
    <div>
      <Notification />
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
