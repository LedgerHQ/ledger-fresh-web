import clsx from "clsx";
import styles from "./Create.module.css";
import Image from "next/image";
import Link from "next/link";
import { LinkCard } from "@/components/Card";

export default function Create() {
  return (
    <>
      <div className={clsx(styles.page)}>
        <main className={styles.main}>
          <Link href="/emboarding" className={styles.icon}>
            <Image
              src="/Icons/arrow-left-rtl.svg"
              alt="back"
              width={20}
              height={20}
              priority
            />
          </Link>
          {/* eslint-disable-next-line */}
          <h2 className={styles.title}>Let's get started!</h2>
          <h5 className={styles.subtitle}>
            How would you like to secure your wallet and sign transactions?
          </h5>

          <LinkCard
            href="/create/mobile"
            title="With this mobile"
            description="Manage your wallet from Chrome on this mobile."
            icon={
              <Image
                src="/Icons/chrome.svg"
                alt="back"
                width={16}
                height={14}
                priority
              />
            }
            img={
              <Image
                src="/Images/mobile.png"
                alt="back"
                width={100}
                height={20}
                priority
              />
            }
          ></LinkCard>

          <h5 className={styles.title_separator}>OR use a portable signer</h5>
          <div className={styles.cardList}>
            <LinkCard
              href="/create/mobile"
              title="With a USB Security Key"
              icon={
                <Image
                  src="/Icons/usb.svg"
                  alt="back"
                  width={14}
                  height={14}
                  priority
                />
              }
              description="Manage your wallet using a USB 
          security key."
              img={
                <Image
                  src="/Images/usbkey.png"
                  alt="back"
                  width={90}
                  height={25}
                  priority
                />
              }
            ></LinkCard>
            <LinkCard
              href="/create/mobile"
              title="With a Ledger"
              description="Sign transactions using your Ledger and 
            add extra layer of security"
              icon={
                <Image
                  src="/Icons/ledgerlogo.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                />
              }
              img={
                <Image
                  src="/Images/ledger.png"
                  alt="back"
                  width={90}
                  height={2}
                  priority
                />
              }
            ></LinkCard>
          </div>
        </main>
      </div>
    </>
  );
}
