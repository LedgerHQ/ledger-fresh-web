import { useState, useEffect } from "react";
import styles from "./Created.module.css";
import { Button } from "@/components/Button";
import Main from "@/components/MainContainer";

export default function Created() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("walletName") || "";
    setUsername(name);
  }, []);

  return (
    <div className="page">
      <Main variant="centered">
        <div className={styles.thumbnail}></div>
        <h2> {username} created!</h2>
      </Main>
      <div className={styles.buttonRow}>
        {/* eslint-disable-next-line */}
        <Button>Let's go</Button>
      </div>
    </div>
  );
}
