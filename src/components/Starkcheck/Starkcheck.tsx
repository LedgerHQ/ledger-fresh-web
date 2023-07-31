import styles from "./Starkcheck.module.css";

interface Props {
  checked: boolean;
  error: string | { errorCode: string };
}

export function Starkcheck({ checked, error, ...props }: Props) {
  if (error) {
    console.log(error);
    console.log(typeof error !== "string" && error.errorCode);
    if (typeof error !== "string" && error.errorCode) {
      switch (error.errorCode) {
        case "StarknetErrorCode.TRANSACTION_FAILED":
          return (
            <div className={styles.row}> ❌ Transaction will fail ❌ </div>
          );

        default:
          return (
            <div className={styles.row}>Unknown error {error.errorCode}</div>
          );
      }
    }

    return <div className={styles.row}>Starkcheck error ❌</div>;
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
