import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../context/TransactionContext";

export default function WithdrawModal({ open, onClose, coin }) {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { addPendingWithdrawal } = useTransactions();

  const handleConfirm = async () => {
    if (!address || !amountUSD) {
      setError("Please complete all fields");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User not found");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // 1️⃣ Write pending transaction using TransactionContext
      await addPendingWithdrawal({
        amountUSD: Number(amountUSD),
        coin: coin?.symbol,
        address,
      });

      // 2️⃣ After transaction is created, check KYC
      if (!userData.kyc || userData.kyc.status !== "submitted") {
        setLoading(false);
        onClose();
        navigate("/verify-identity");
        return;
      }

      // 3️⃣ KYC is fine → complete
      setLoading(false);
      onClose();
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            background: "#111",
            border: "1px solid #30363d",
            borderRadius: "12px",
            p: 4,
            width: "90%",
            maxWidth: 420,
            mx: "auto",
            mt: "10%",
            textAlign: "center",
            boxShadow: "0 0 15px rgba(255,0,0,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: "#ff3b3b", fontWeight: 600 }}>
            Withdraw {coin?.symbol}
          </Typography>

          <TextField
            fullWidth
            label={`${coin?.symbol} Address`}
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "#ccc",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#ff3b3b" },
              },
              "& .MuiInputLabel-root": { color: "#777" },
            }}
          />

          <TextField
            fullWidth
            label="Amount (USD)"
            variant="outlined"
            type="number"
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#ccc",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#ff3b3b" },
              },
              "& .MuiInputLabel-root": { color: "#777" },
            }}
          />

          {loading ? (
            <CircularProgress sx={{ color: "#ff3b3b", my: 2 }} />
          ) : (
            <Button
              variant="contained"
              onClick={handleConfirm}
              sx={{
                background: "#ff3b3b",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                py: 1,
                "&:hover": { background: "#ff5555" },
              }}
            >
              Confirm Withdraw
            </Button>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ background: "#ff3b3b", color: "#fff" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

