import React, { useState, useRef } from "react";
import CoinSelectionModal from "./CoinSelectionModal";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import KYCModal from "./KYCModal";

export default function DepositWithdrawController({ children }) {
  const [coinSelectOpen, setCoinSelectOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const actionRef = useRef(null);

  const openDepositFlow = () => {
    actionRef.current = "deposit";
    setCoinSelectOpen(true);
  };

  const openWithdrawFlow = () => {
    actionRef.current = "withdraw";
    setCoinSelectOpen(true);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setCoinSelectOpen(false);

    if (actionRef.current === "deposit") {
      setDepositOpen(true);
    } else if (actionRef.current === "withdraw") {
      setWithdrawOpen(true);
    }
  };

  const openKycFlow = () => {
    // Close withdraw modal and open KYC
    setWithdrawOpen(false);
    setKycOpen(true);
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
        openKYC={openKycFlow} // ← 🔥 THIS TRIGGERS KYC
        coin={selectedCoin}
      />

      <KYCModal
        open={kycOpen}
        onClose={() => setKycOpen(false)}
      />
    </>
  );
}

