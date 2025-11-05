import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [loading, setLoading] = useState(true);
  const BTC_RATE = 68000;

  // --- Watch Firebase Auth user ---
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        // Ensure user doc exists
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { balanceUSD: 0 });
        } else {
          setBalanceUSD(snap.data().balanceUSD || 0);
        }

        // Realtime listener for balance
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setBalanceUSD(docSnap.data().balanceUSD || 0);
          }
        });

        // Realtime listener for transactions
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const unsubTx = onSnapshot(q, (snapshot) => {
          const txs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setTransactions(txs);
          setLoading(false);
        });

        return () => {
          unsubUser();
          unsubTx();
        };
      } else {
        setTransactions([]);
        setBalanceUSD(0);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // --- Add transaction ---
  const addTransaction = async (type, amountUSD) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const newBalance =
      type === "deposit" ? balanceUSD + amountUSD : balanceUSD - amountUSD;

    // Update user balance
    await updateDoc(userRef, { balanceUSD: newBalance });
    setBalanceUSD(newBalance);

    // Record transaction
    await addDoc(collection(db, "transactions"), {
      userId: user.uid,
      type,
      amountUSD,
      amountBTC: (amountUSD / BTC_RATE).toFixed(6),
      status: "Success",
      createdAt: serverTimestamp(),
    });
  };

  const resetData = () => {
    setBalanceUSD(0);
    setTransactions([]);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        balanceUSD,
        loading,
        addTransaction,
        resetData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);

