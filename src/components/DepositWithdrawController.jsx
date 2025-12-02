import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import CoinSelectionModal from "./CoinSelectionModal";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";

export default function DepositWithdrawController({ children }) {
  const [coinSelectOpen, setCoinSelectOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const actionRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 DEPOSIT FLOW
  const openDepositFlow = () => {
    actionRef.current = "deposit";
    setCoinSelectOpen(true);
  };

  // 🔥 WITHDRAW FLOW — now includes KYC check
  const openWithdrawFlow = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Get user KYC status
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    // 🚨 If user has NOT completed KYC → send to KYC page
    if (!userData.kyc || userData.kyc.status !== "submitted") {
      navigate("/verify-identity");
      return;
    }

    // ✔ If KYC is done → continue withdraw flow
    actionRef.current = "withdraw";
    setCoinSelectOpen(true);
  };

  // Handle coin selection
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setCoinSelectOpen(false);

    if (actionRef.current === "deposit") {
      setDepositOpen(true);
    } else if (actionRef.current === "withdraw") {
      setWithdrawOpen(true);
    }
  };

  // 🔥 Withdraw modal → user clicks Confirm Withdraw → open this
  const openKycFlow = () => {
    setWithdrawOpen(false);
    navigate("/verify-identity"); // Full-page KYC screen
  };

  return (
    <>
      {children({
        openDeposit: openDepositFlow,
        openWithdraw: openWithdrawFlow,
      })}

      <CoinSelectionModal
        open={coinSelectOpen}
        onClose={() => setCoinSelectOpen(false)}
        onSelect={handleCoinSelect}
      />

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        coin={selectedCoin}
      />

      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        openKYC={openKycFlow}
        coin={selectedCoin}
      />
    </>
  );
}

