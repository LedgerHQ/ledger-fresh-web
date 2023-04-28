import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import React, { useState } from "react";
import { NotificationContext } from "@/services/notificationProvider";
import { Transaction } from "ethers";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [notification, setNotification] = useState<Transaction>();

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
          letter-spacing: -0.02em;
        }
      `}</style>
      <NotificationContext.Provider value={{ notification, setNotification }}>
        <Component {...pageProps} />
      </NotificationContext.Provider>
    </>
  );
}
