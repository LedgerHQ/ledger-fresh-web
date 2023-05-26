import {
  WalletAccount,
  getAccounts,
} from "@/services/accountStorage/account.storage";
import { signAndSendTransaction } from "@/utils/webauthn";
import { usePenpalParent } from "@weblivion/react-penpal";
import { useEffect, useState } from "react";
import styles from "./Account.module.css";
import { Button } from "@/components/Button";

import {
  Abi,
  constants as starknetConstant,
  Call,
  InvocationsDetails,
  typedData,
} from "starknet";
import { Starkcheck } from "@/components/Starkcheck";

let resolveTxHashPromise: (value: string) => void;
let rejectTxHashPromise: (reason?: any) => void;
const txHashPromise: Promise<string> = new Promise((resolve, reject) => {
  resolveTxHashPromise = resolve;
  rejectTxHashPromise = reject;
});

function apicall(fn: () => void, delay: number): void {
  setTimeout(fn, delay);
}

export default function AccountModal() {
  const [checked, setChecked] = useState<boolean>(false);
  const [calls, setCalls] = useState<Call>();

  const { parentMethods, connection } = usePenpalParent({
    methods: {
      enable() {
        const accounts = getAccounts();
        return {
          address: accounts[0]?.address,
          chainid: accounts[0]?.networkId,
        };
      },
      async execute(
        calls: Call,
        abis: Abi[] | undefined,
        transactionsDetail: any
      ) {
        setChecked(false);
        setCalls(calls);
        const transaction_hash = await txHashPromise;
        return { transaction_hash };
      },
      async signMessage(typedData: typedData.TypedData) {
        return [
          "0xceda96c27790f5a5d7d2eb9a9463cfd4843c823603cdfa04e07ef38beef4f6",
          "0x49b5dd5a68c26e03de4c398749efb4d9fa79736492463cffb0a823415716fe4",
        ];
      },
      isPreauthorized(host: string) {
        throw Error("not implemented");
      },
      addNetwork(params: any) {
        throw Error("not implemented");
      },
      switchNetwork(params: any) {
        throw Error("not implemented");
      },
      addToken(params: any) {
        throw Error("not implemented");
      },
    },
  });

  useEffect(() => {
    const notify = async () => {
      const accounts = getAccounts();
      if (accounts.length) {
        if (connection) {
          await parentMethods.notifyAccountChange(accounts[0]?.address);
          await parentMethods.notifyNetworkChange(accounts[0]?.networkId);
        }
      }
    };
    notify();
  }, [connection]);

  useEffect(() => {
    if (!calls) return;
    parentMethods.shouldShow();
    apicall(() => setChecked(true), 2000);
  }, [calls]);

  const _execute = async () => {
    if (!calls) return;
    const account = getAccounts()[0];
    const res: { nonce: string } = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/getNonce`,
      {
        method: "POST",
        body: JSON.stringify({
          address: account.address,
        }),
      }
    ).then((response) => response.json());
    const invoDetails = {
      walletAddress: account.address,
      version: "0x1",
      maxFee: "20000000000000000",
      chainId: starknetConstant.StarknetChainId.TESTNET,
      nonce: res.nonce,
    };
    const transaction_hash = await signAndSendTransaction(
      [calls],
      invoDetails,
      account.authenticatorId
    );
    resolveTxHashPromise(transaction_hash);
    parentMethods.shouldHide();
  };

  const close = () => {
    rejectTxHashPromise("Transaction cancelled by user");
    parentMethods.shouldHide();
  };

  // if (!calls) return <div>hidden :)</div>;
  return (
    <div className={styles.account}>
      <div>
        <h2 className={styles.title}>Review call </h2>
        <div>
          <h4> Action: </h4>
          <div> Transfer </div>
          <h4> CallData: </h4>
          <div>To: {calls?.contractAddress.slice(0, 10)}...</div>
          <div>Amount: {calls?.calldata?.[1].toString()} wei</div>
        </div>
      </div>
      <div>
        <Starkcheck checked={checked} />
        <div className={styles.buttonRow}>
          <Button
            className={styles.buttonLeft}
            variant="destructive"
            onClick={(_) => close()}
          >
            Reject
          </Button>
          <Button onClick={(_) => _execute()}> Sign ＼ʕ •ᴥ•ʔ／ </Button>
        </div>
      </div>
    </div>
  );
}
