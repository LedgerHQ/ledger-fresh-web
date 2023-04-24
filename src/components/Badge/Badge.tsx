import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./Badge.module.css";

interface Props {
  variant?: "primary" | "secondary" | "subtle" | "destructive" | "blue";
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}
export function Badge({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        className,
        styles.badge,
        icon && !children && styles.iconbadge,
        {
          [styles.badgePrimary]: variant === "primary",
          [styles.badgeSecondary]: variant === "secondary",
          [styles.badgeSubtle]: variant === "subtle",
          [styles.badgeDestructive]: variant === "destructive",
          [styles.badgeBlue]: variant === "blue",
        }
      )}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.label}>{children}</span>}
    </div>
  );
}
