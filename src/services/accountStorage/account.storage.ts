export interface WalletAccount {
  address: string;
  networkId: string;
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
