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

  useEffect(() => {
    let unsubUser = null;
    let unsubTx = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setTransactions([]);
        setBalanceUSD(0);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);

        // Ensure user doc exists
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { balanceUSD: 0 });
          setBalanceUSD(0);
        } else {
          setBalanceUSD(snap.data().balanceUSD || 0);
        }

        // Real-time listener for user balance
        unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setBalanceUSD(docSnap.data().balanceUSD || 0);
          }
        });

        // Real-time listener for transactions
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        unsubTx = onSnapshot(
          q,
          (snapshot) => {
            const txs = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                ...data,
                type: data.type?.toLowerCase() || "", // normalize type to lowercase
              };
            });
            setTransactions(txs);
            setLoading(false);
          },
          (error) => {
            console.error("Transactions listener error:", error);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("TransactionProvider error:", err);
        setLoading(false);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAuth();
      if (unsubUser) unsubUser();
      if (unsubTx) unsubTx();
    };
  }, []);

  // Function to add a transaction
  const addTransaction = async (type, amountUSD) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const normalizedType = type.toLowerCase();
    const newBalance =
      normalizedType === "deposit" ? balanceUSD + amountUSD : balanceUSD - amountUSD;

    // Update user balance
    await updateDoc(userRef, { balanceUSD: newBalance });
    setBalanceUSD(newBalance);

    // Record transaction
    await addDoc(collection(db, "transactions"), {
      userId: user.uid,
      type: normalizedType, // store lowercase for consistency
      amountUSD,
      amountBTC: (amountUSD / BTC_RATE).toFixed(6),
      status: "Success",
      createdAt: serverTimestamp(),
    });
  };

  // Reset context data
  const resetData = () => {
    setBalanceUSD(0);
    setTransactions([]);
    setLoading(false);
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

