import styles from "./Starkcheck.module.css";

interface Props {
  checked: boolean;
  error: string;
}

export function Starkcheck({ checked, error, ...props }: Props) {
  if (error) {
    return (
      <div className={styles.row}>
        Starkcheck error ❌ <p>{error}</p>
      </div>
    );
  }
  if (!checked) {
    return (
      <div className={styles.row}>
        Starkcheck in progress... <div className={styles.loader} />
      </div>
    );
  }
  return <div className={styles.row}> Transaction is safe ✅ </div>;
}
