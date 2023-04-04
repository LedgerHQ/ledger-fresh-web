import Image from "next/image";
import styles from "./TokenList.module.css";

interface Props {
  src: string;
  size: number;
  label: string;
}

export function TokenBadge({ src, size, label, ...props }: Props) {
  return (
    <div className={styles.badge}>
      <div
        className={styles.icon}
        style={{
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          borderRadius: `${size - 3}px`,
        }}
      >
        <Image src={src} alt="back" width={size} height={size} priority />
      </div>
      <label className={styles.label}> {label} </label>
    </div>
  );
}
