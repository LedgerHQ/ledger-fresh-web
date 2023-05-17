import clsx from "clsx";
import styles from "./Security.module.css";
import Image from "next/image";
import Main from "@/components/MainContainer";
import { AddLedgerCard, LinkCard } from "@/components/Card";

import { Header } from "@/components/Header";

export default function Onboarding() {
  return (
    <>
      <Header />
      <div className="page">
        <Main variant="left" className={styles.main}>
          <h2 className={styles.title}>Customize your wallet</h2>
          <div className={styles.buttonRow}>
            <LinkCard
              href="/security"
              variant="noBg"
              title="Security rules"
              description="Manage your rules for your & interactions"
              className={clsx(styles.card, styles.open)}
              icon={
                <Image
                  src="/Icons/shield.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                />
              }
            >
              <div className={styles.apps}>
                <div className={styles.app}>
                  <div className={styles.logo}>
                    <Image
                      src="/Icons/AVNU.svg"
                      alt="back"
                      width={30}
                      height={30}
                      priority
                    />
                    <span className={styles.appName}> AVNU </span>
                  </div>
                  <button className={styles.remove}> Remove </button>
                </div>
                <div className={styles.app}>
                  <div className={styles.logo}>
                    <Image
                      src="/Icons/starknetId.svg"
                      alt="back"
                      width={30}
                      height={20}
                      priority
                    />
                    <span className={styles.appName}> Starknet Id </span>
                  </div>
                  <button className={styles.remove}> Remove </button>
                </div>
              </div>
            </LinkCard>
            <LinkCard
              href="/settings"
              variant="noBg"
              title="Signers"
              description="Manage your signers"
              className={styles.card}
              icon={
                <Image
                  src="/Icons/wallet.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                />
              }
            ></LinkCard>
            <LinkCard
              href="/settings"
              variant="noBg"
              title="Plugins"
              description="Add features to your wallet"
              className={styles.card}
              icon={
                <Image
                  src="/Icons/puzzle.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                />
              }
            ></LinkCard>
            <LinkCard
              href="/settings"
              variant="noBg"
              title="Local settings"
              description="Manage your wallet’s local settings"
              className={styles.card}
              icon={
                <Image
                  src="/Icons/wallet-minimal.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                />
              }
            ></LinkCard>
            <AddLedgerCard />
          </div>
        </Main>
      </div>
    </>
  );
}
