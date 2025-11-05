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
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function WithdrawModal({ open, onClose }) {
  const [address, setAddress] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleWithdraw = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not signed in.");

      const amount = parseFloat(amountUSD);
      if (!address || isNaN(amount) || amount <= 0) {
        throw new Error("Enter a valid BTC address and amount.");
      }

      // Fetch current user balance
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User record not found.");

      const userData = userSnap.data();
      const currentBalance = userData.balanceUSD || 0;

      if (amount > currentBalance) {
        throw new Error("Insufficient balance for this withdrawal.");
      }

      const BTC_RATE = 68000; // mock conversion rate
      const amountBTC = (amount / BTC_RATE).toFixed(5);

      // Add transaction record
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "Withdrawal",
        amountUSD: amount,
        amountBTC,
        address,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      // Deduct from user balance
      await updateDoc(userRef, {
        balanceUSD: currentBalance - amount,
      });

      // Success feedback
      setMessage(`Withdrawal of $${amount} requested successfully!`);
      setAddress("");
      setAmountUSD("");
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(err.message);
    } finally {
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
          <Typography variant="h6" sx={{ mb: 2, color: "#ff3b3b" }}>
            Withdraw Bitcoin
          </Typography>

          <TextField
            fullWidth
            label="BTC Address"
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
              onClick={handleWithdraw}
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

      {/* Success Snackbar */}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ background: "#ff3b3b", color: "#fff" }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
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

