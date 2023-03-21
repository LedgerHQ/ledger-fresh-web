import { useState, useEffect } from "react";
import styles from "./Created.module.css";
import { Button } from "@/components/Button";

import { getKeyCredentialCreationOptions } from "@/utils/webauthn";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("walletName") || "";
    setUsername(name);
  }, []);

  return (
    <div className="page">
      <main className={styles.main}>
        <div className={styles.thumbnail}></div>
        <h2> {username} created!</h2>
      </main>
      <div className={styles.buttonRow}>
        {/* eslint-disable-next-line */}
        <Button>Let's go</Button>
      </div>
    </div>
  );
}
