import React, { useState, useEffect, useRef } from "react";
import styles from "./WalletSelector.module.css";
import {
  getAccounts,
  getSelectedAccount,
  setStorageSelectedAccount,
  WalletAccount,
} from "@/services/accountStorage/account.storage";
import { useAccount } from "@/services/accountStorage/AccountContext";

interface Props {}

export function WalletSelector({ ...props }: Props) {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const { selectedAccount, setSelectedAccount } = useAccount();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const accounts = getAccounts();
    setAccounts(accounts);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAccountSelect = (name: string) => {
    const selectedAccount = accounts.find((account) => account.name === name);
    if (selectedAccount) {
      setSelectedAccount(selectedAccount); // update context
      setStorageSelectedAccount(selectedAccount); // update localStorage
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className={styles.wrapper} onClick={handleDropdown} ref={dropdownRef}>
      <div className={styles.thumbnail} />
      <div>{selectedAccount?.name}</div>
      {isDropdownOpen && (
        <div className={styles.dropdownContent}>
          {accounts.map((account) => (
            <div
              key={account.name}
              onClick={() => handleAccountSelect(account.name)}
            >
              {account.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
