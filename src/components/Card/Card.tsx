import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, forwardRef, ReactNode } from "react";
import styles from "./Card.module.css";

interface Props {
  variant?: "primary" | "secondary" | "subtle" | "destructive";
  title?: string;
  description?: string;
  icon?: ReactNode;
  img?: ReactNode;
}

export function LinkCard({
  variant = "primary",
  title,
  description,
  img,
  icon,
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & Props) {
  return (
    <Link
      className={clsx(
        className,
        styles.card,
        icon && !children && styles.iconButton,
        {
          [styles.buttonPrimary]: variant === "primary",
          [styles.buttonSecondary]: variant === "secondary",
          [styles.buttonSubtle]: variant === "subtle",
          [styles.buttonDestructive]: variant === "destructive",
        }
      )}
      {...props}
    >
      <div className={styles.main}>
        {/* {icon && <span className={styles.icon}>{icon}</span>} */}
        <div>
          <h3> {title} </h3>
          <p className={styles.description}> {description}</p>
        </div>
        {img}
      </div>
      {children && <span className={styles.label}>{children}</span>}
    </Link>
  );
}
