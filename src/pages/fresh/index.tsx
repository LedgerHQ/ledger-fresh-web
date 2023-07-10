import {
  WalletAccount,
  getAccounts,
} from "@/services/accountStorage/account.storage";
import { signAndSendTransaction } from "@/utils/webauthn";
import { usePenpalParent } from "@weblivion/react-penpal";
import { useEffect, useState } from "react";
import styles from "./Account.module.css";
import { Button } from "@/components/Button";
import { Calls } from "@/components/Calls";

import {
  Abi,
  constants as starknetConstant,
  Call,
  Signature,
  typedData,
} from "starknet";
import { Starkcheck } from "@/components/Starkcheck";
import { starkCheck, StarkcheckAnswer } from "@/utils/starkcheck";
import { BalanceChangesList } from "@/components/BalanceChanges";

let resolveTxHashPromise: (value: string) => void;
let rejectTxHashPromise: (reason?: any) => void;
const txHashPromise: Promise<string> = new Promise((resolve, reject) => {
  resolveTxHashPromise = resolve;
  rejectTxHashPromise = reject;
});

let resolveAccountPromise: (value: WalletAccount) => void;
let rejectAccountPromise: (reason?: any) => void;

function createConnectAccountPromise(): Promise<WalletAccount> {
  return new Promise<WalletAccount>((resolve, reject) => {
    resolveAccountPromise = resolve;
    rejectAccountPromise = reject;
  });
}

// We're not creating the Promise just yet
let connectAccount: Promise<WalletAccount> | null = null;

const STARKCHECK_ENDPOINT = process.env.NEXT_PUBLIC_STARKCHECK_API_ENDPOINT!;

export default function AccountModal() {
  const [checked, setChecked] = useState<boolean>(false);
  const [account, setAccount] = useState<WalletAccount>();
  const [error, setError] = useState<any>();
  const [calls, setCalls] = useState<Call[]>();
  const [isConnect, setConnect] = useState<boolean>(false);
  const [sig, setSig] = useState<StarkcheckAnswer>();
  const { parentMethods, connection } = usePenpalParent({
    parentOrigin: "*",
    methods: {
      async enable() {
        // We create a new Promise each time enable is called
        connectAccount = createConnectAccountPromise();
        setConnect(true);
        try {
          const account = await connectAccount;
          setConnect(false);
          setAccount(account);
          return {
            address: account.address,
            chainid: account.networkId,
          };
        } catch (error) {
          // Handle the error (for example, set some state variable)
          setConnect(false);
          throw error;
        }
      },
      async execute(
        calls: Call[] | Call,
        abis: Abi[] | undefined,
        transactionsDetail: any
      ) {
        setChecked(false);
        setError(false);
        setCalls(Array.isArray(calls) ? calls : [calls]);
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

  // useEffect(() => {
  //   const notify = async () => {
  //     const accounts = getAccounts();
  //     if (accounts.length) {
  //       if (connection) {
  //         await parentMethods.notifyAccountChange(accounts[0]?.address);
  //         await parentMethods.notifyNetworkChange(accounts[0]?.networkId);
  //       }
  //     }
  //   };
  //   notify();
  // }, [connection]);

  useEffect(() => {
    if (!isConnect) return;
    parentMethods.shouldShow();
  }, [isConnect]);
  useEffect(() => {
    if (!calls) return;
    parentMethods.shouldShow();
    const starkCheckCall = async () => {
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
        type: "INVOKE_FUNCTION",
        chainId: starknetConstant.StarknetChainId.TESTNET,
        nonce: res.nonce,
      };
      try {
        const starkCheckSignature = await starkCheck(calls, invoDetails, "0x1");
        setSig(starkCheckSignature);
        setChecked(true);
      } catch (error) {
        setError(error);
      }
    };
    starkCheckCall();
  }, [calls]);

  const _execute = async () => {
    if (!calls || !sig) return;
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
      type: "INVOKE_FUNCTION",
      chainId: starknetConstant.StarknetChainId.TESTNET,
      nonce: res.nonce,
    };

    const transaction_hash = await signAndSendTransaction(
      calls,
      invoDetails,
      account.authenticatorId,
      sig.signature
    );
    resolveTxHashPromise(transaction_hash);

    parentMethods.shouldHide();
  };

  const close = () => {
    rejectTxHashPromise("Transaction cancelled by user");
    parentMethods.shouldHide();
  };

  const closeLogin = () => {
    rejectAccountPromise("Not in the mood to connect");
    parentMethods.shouldHide();
  };

  const handleConnect = async (account: WalletAccount) => {
    resolveAccountPromise(account);
    parentMethods.shouldHide();
  };

  if (isConnect) {
    const accounts: WalletAccount[] = getAccounts();
    return (
      <div className={styles.login}>
        <h2 className={styles.title}> Choose your Fresh Account </h2>
        {accounts && accounts.length > 0 ? (
          accounts.map((account, index) => (
            <form
              key={index}
              onSubmit={() => handleConnect(account)}
              className={styles.button}
            >
              <Button type="submit">
                Connect with {account.name} ({account.address.slice(0, 10)}...)
              </Button>
            </form>
          ))
        ) : (
          <div>
            Create an account on:
            <a
              href="https://fresh-web.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              fresh-web.vercel.app
            </a>
          </div>
        )}
        <Button
          onClick={() => {
            closeLogin();
          }}
        >
          Close{" "}
        </Button>
      </div>
    );
  }

  if (!calls) return <div>hidden :)</div>;

  console.log(account, sig);

  return (
    <div className={styles.account}>
      <div>
        {account && sig && sig.balanceChanges && (
          <BalanceChangesList
            accountAddress={account.address}
            changes={sig.balanceChanges}
          />
        )}

        <h2 className={styles.title}>Review calls </h2>
        <Calls calls={calls} />
      </div>
      <div>
        <Starkcheck checked={checked} error={error} />
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
