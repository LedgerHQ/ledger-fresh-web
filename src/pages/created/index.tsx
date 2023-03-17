import { useState } from "react";
import styles from "./Created.module.css";
import { Button } from "@/components/Button";

import { getKeyCredentialCreationOptions } from "@/utils/webauthn";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState<string>("");

  // @TODO componentWillMount is still something that exist????
  // const credential = await navigator.credentials.get();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.thumbnail}></div>
        <h2> Satoshigangsta created!</h2>
      </main>
      <div className={styles.buttonRow}>
        {/* eslint-disable-next-line */}
        <Button>Let's go</Button>
      </div>
    </div>
  );
}
