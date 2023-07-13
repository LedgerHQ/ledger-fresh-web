"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getSelectedAccount,
  WalletAccount,
} from "@/services/accountStorage/account.storage";

type AccountContextProps = {
  selectedAccount: WalletAccount | null;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<WalletAccount | null>
  >;
};

const AccountContext = createContext<AccountContextProps | undefined>(
  undefined
);

type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(
    null
  );

  useEffect(() => {
    const storedAccount = getSelectedAccount();
    setSelectedAccount(storedAccount);
  }, []);

  // Optional: Listen for changes in local storage
  useEffect(() => {
    const handleStorageChange = () => {
      setSelectedAccount(getSelectedAccount());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};
