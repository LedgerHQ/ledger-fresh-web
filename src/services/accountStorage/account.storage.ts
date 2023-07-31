export interface WalletAccount {
  address: string;
  networkId: string;
  name: string;
  authenticatorId: string;
}

export function getAccounts(): WalletAccount[] {
  const accounts = localStorage.getItem("fresh_account");
  if (!accounts) return [];

  return JSON.parse(accounts);
}

export function addAccount(account: WalletAccount) {
  const accounts = getAccounts();
  accounts.push(account);
  localStorage.setItem("fresh_account", JSON.stringify(accounts));
}

export function removeAccount(account: WalletAccount) {
  const accounts = getAccounts();
  accounts.filter(
    (acc) =>
      !(account.address == acc.address && account.networkId == acc.networkId)
  );
  localStorage.setItem("fresh_account", JSON.stringify(accounts));
}

export function setStorageSelectedAccount(account: WalletAccount) {
  localStorage.setItem("selected_account", JSON.stringify(account));
}

export function getSelectedAccount(): WalletAccount | null {
  const account = localStorage.getItem("selected_account");
  if (!account) {
    const accounts = getAccounts();
    if (!accounts) return null;
    setStorageSelectedAccount(accounts[0]);
    return accounts[0];
  }
  return JSON.parse(account);
}
