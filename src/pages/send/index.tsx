import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./Send.module.css";
import Main from "@/components/MainContainer";
import { Header } from "@/components/Header";
import { LinkButton, Button } from "@/components/Button";
import {
  getAccounts,
  WalletAccount,
} from "@/services/accountStorage/account.storage";
import { TokenBadge } from "@/components/TokenList";
import { signAndSendTransaction } from "@/utils/webauthn";
import { constants } from "@/utils/constant";
import { useRouter } from "next/router";

import {
  constants as starknetConstant,
  stark,
  number,
  uint256,
  Provider,
} from "starknet";
import { addTransaction } from "@/services/transactionStorage/transaction.storage";

export default function Send() {
  const [account, setAccount] = useState<WalletAccount>();
  const [amount, setAmount] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const router = useRouter();

  const sendToken = async () => {
    if (!account) return;
    try {
      const { low, high }: any = uint256.bnToUint256(amount);
      const calldata = stark.compileCalldata({
        dest: address,
        low,
        high,
      });
      const call = [
        {
          entrypoint: "transfer",
          contractAddress: constants.ERC20.ETH.address,
          calldata,
        },
      ];

      const res: { nonce: string } = await fetch("/api/account/getNonce", {
        method: "POST",
        body: JSON.stringify({
          address: account.address,
        }),
      }).then((response) => response.json());
      // TODO getNonce
      const invoDetails = {
        walletAddress: account.address,
        version: "0x1",
        maxFee: "20000000000000000",
        chainId: starknetConstant.StarknetChainId.TESTNET,
        nonce: res.nonce,
      };
      const transaction_hash = await signAndSendTransaction(
        call,
        invoDetails,
        account.authenticatorId
      );

      addTransaction({
        networkId: account.networkId,
        hash: transaction_hash,
        type: 20,
        data: ["ETH", amount],
        hidden: false,
      });

      router.push("/");
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    const accounts = getAccounts();
    if (accounts.length) {
      console.log(accounts);
      setAccount(accounts[0]);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Ledger Fresh -- Send</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <Main variant="centered">
          <div className={styles.badgeContainer}>
            <TokenBadge label="Ethereum" src="/Icons/ETH.svg" size={14} />
          </div>
          <input
            className={styles.amount}
            name="username"
            type="number"
            data-1p-ignore
            value={amount}
            autoComplete="off"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
          <input
            className={styles.address}
            data-1p-ignore
            name="Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0xdeadbabe..."
          />
        </Main>
        <section className={styles.footer}>
          <Button className={styles.sendButton} onClick={sendToken}>
            Send
          </Button>
        </section>
      </div>
    </>
  );
}
