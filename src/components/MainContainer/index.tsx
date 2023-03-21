import { ComponentProps, ReactNode } from "react";
import styles from "./Main.module.css";
import clsx from "clsx";

type Props = {
  children: JSX.Element | JSX.Element[];
  variant?: "centered" | "left";
  className?: string;
};

export default function Main({
  variant = "left",
  children,
  className,
  ...props
}: Props) {
  return (
    <main className={clsx(className, styles.main)} data-variant={variant}>
      {children}
    </main>
  );
}
