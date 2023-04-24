import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, forwardRef, ReactNode } from "react";
import styles from "./Card.module.css";
import { Badge } from "@/components/Badge";

interface Props {
  variant?: "primary" | "secondary" | "subtle" | "destructive";
  title?: string | ReactNode;
  description?: string | ReactNode;
  icon?: ReactNode;
  img?: ReactNode;
  children?: ReactNode;
  className?: string;
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
        <div className={styles.iconContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
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

export function InfoCard({
  title,
  description,
  img,
  icon,
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        className,
        styles.infoCard,
        icon && !children && styles.iconButton
      )}
      {...props}
    >
      <div className={styles.main}>
        <div>
          <h3> {title} </h3>
          <p className={styles.description}> {description}</p>
        </div>
      </div>
      {children && <span className={styles.label}>{children}</span>}
    </div>
  );
}

export function AddLedgerCard() {
  return (
    <InfoCard
      title={
        <div className={styles.infoTitle}>
          <div>
            <div> For your security </div>
            <div>Add a Ledger as signer</div>
          </div>
          <Badge variant="blue"> Most secured </Badge>
        </div>
      }
      description={
        <div>
          <div>Sign transactions using a Ledger. </div>
          <div>
            {/* eslint-disable-next-line */}
            You'll be able to use your wallet from any mobile or desktop with
            your Ledger.
          </div>
        </div>
      }
    ></InfoCard>
  );
}
