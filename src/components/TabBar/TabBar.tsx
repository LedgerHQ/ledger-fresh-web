import React, { useState } from "react";
import styles from "./TabBar.module.css";

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
  return (
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
  );
}
