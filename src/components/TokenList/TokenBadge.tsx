import Image from "next/image";
import styles from "./TokenList.module.css";

interface Props {
  src: string;
  size: number;
  label: string;
}

export function TokenBagde({ src, size, label, ...props }: Props) {
  return (
    <div className={styles.badge}>
      <div className={styles.icon}>
        <Image src={src} alt="back" width={size} height={size} priority />
      </div>
      <p> {label} </p>
    </div>
  );
}
