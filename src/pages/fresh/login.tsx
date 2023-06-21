import { Button } from "@/components/Button";
import {
  WalletAccount,
  getAccounts,
} from "@/services/accountStorage/account.storage";
import { login } from "@/utils/webauthn";
import { usePenpalParent } from "@weblivion/react-penpal";
import { useState, useEffect } from "react";

export default function LoginModal() {
  const [account, setAccount] = useState<WalletAccount>();
  useEffect(() => {
    const accounts = getAccounts();
    if (accounts.length) {
      setAccount(accounts[0]);
    } else {
    }
  }, []);
  const { parentMethods, connection } = usePenpalParent({
    methods: {
      enable() {
        return {
          code: "LOGIN",
          address: account?.address || "lol",
        };
      },
    },
  });

  const handleConnect = async (e: any) => {
    e.preventDefault();
    console.log(parentMethods, connection);
    if (await login()) {
      console.log("Authentication success!");
      if (connection) {
        await parentMethods.connect();
      } else {
        console.log("No connection to parent frame :(");
      }
    } else console.log("Authentication failure!");
  };

  if (account) {
    return (
      <div>
        <form onSubmit={handleConnect}>
          <Button type="submit" style={{ marginTop: "10px" }}>
            Connect with {account.name} ({account.address.slice(0, 10)}...)
          </Button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        Create an account on <span> fresh-web.vercel.app </span>
      </div>
    );
  }
}
