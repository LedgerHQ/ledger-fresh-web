export interface Transaction {
  hash: string;
  networkId: string;
  type: number;
  data: string[];
  hidden: boolean;
}

export function getTransactions(): Transaction[] {
  const transactions = localStorage.getItem("transactions");
  if (!transactions) return [];

  return JSON.parse(transactions);
}

export function addTransaction(transaction: Transaction) {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function removeTransaction(transaction: Transaction) {
  const transactions = getTransactions();
  transactions.filter(
    (acc) =>
      !(transaction.hash == acc.hash && transaction.networkId == acc.networkId)
  );
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function hideLastTransaction() {
  const transactions = getTransactions();
  transactions[transactions.length - 1].hidden =
    !transactions[transactions.length - 1].hidden;
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
