import { useState, useEffect } from "react";
import styles from "./Created.module.css";
import { LinkButton } from "@/components/Button";
import Main from "@/components/MainContainer";
import { getAccounts } from "@/services/accountStorage/account.storage";
export default function Created() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const accounts = getAccounts();
    setUsername(accounts[0].name);
  }, []);

  return (
    <div className="page">
      <Main variant="centered">
        <div className={styles.thumbnail}></div>
        <h2> {username} created!</h2>
      </Main>
      <div className={styles.buttonRow}>
        {/* eslint-disable-next-line */}
        <LinkButton href={"/"}>Let's go</LinkButton>
      </div>
    </div>
  );
}
