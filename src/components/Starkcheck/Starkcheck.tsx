import styles from "./Starkcheck.module.css";

interface Props {
  checked: boolean;
}

export function Starkcheck({ checked, ...props }: Props) {
  if (!checked) {
    return (
      <div className={styles.row}>
        Starkcheck in progress... <div className={styles.loader} />
      </div>
    );
  }
  return <div className={styles.row}> Transaction is safe ✅ </div>;
}
