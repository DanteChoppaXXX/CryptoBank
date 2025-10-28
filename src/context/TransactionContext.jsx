
import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balanceUSD, setBalanceUSD] = useState(0);

  const BTC_RATE = 68000;

  // --- LOAD FROM LOCALSTORAGE ON STARTUP ---
  useEffect(() => {
    const savedBalance = localStorage.getItem("qfs_balance");
    const savedTransactions = localStorage.getItem("qfs_transactions");

    if (savedBalance) setBalanceUSD(parseFloat(savedBalance));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // --- SAVE WHENEVER SOMETHING CHANGES ---
  useEffect(() => {
    localStorage.setItem("qfs_balance", balanceUSD);
    localStorage.setItem("qfs_transactions", JSON.stringify(transactions));
  }, [balanceUSD, transactions]);

  // --- ADD TRANSACTION ---
  const addTransaction = (type, amountUSD) => {
    const newBalance =
      type === "deposit" ? balanceUSD + amountUSD : balanceUSD - amountUSD;

    const newTx = {
      id: Date.now(),
      type: type === "deposit" ? "Deposit" : "Withdraw",
      amountUSD: amountUSD.toFixed(2),
      amountBTC: (amountUSD / BTC_RATE).toFixed(6),
      status: "Success",
      date: new Date().toLocaleString(),
    };

    setBalanceUSD(newBalance);
    setTransactions((prev) => [newTx, ...prev]);
  };

  // --- CLEAR ALL DATA (for testing or logout) ---
  const resetData = () => {
    setBalanceUSD(0);
    setTransactions([]);
    localStorage.removeItem("qfs_balance");
    localStorage.removeItem("qfs_transactions");
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        balanceUSD,
        addTransaction,
        resetData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);

