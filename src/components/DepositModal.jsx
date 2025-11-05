import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QRCodeCanvas } from "qrcode.react";
import { auth, db } from "../firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function DepositModal({ open, onClose }) {
  const [depositAddress, setDepositAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Simulate address generation — later this can come from backend
  useEffect(() => {
    if (open) {
      setDepositAddress("");
      setSuccessMessage("");
      setLoading(true);

      // Simulate async API call (e.g. to your backend)
      setTimeout(() => {
        // Replace this with real backend-generated address
        const mockAddress = "bc1qexampledepositaddress12345xyz";
        setDepositAddress(mockAddress);
        setLoading(false);
      }, 1200);
    }
  }, [open]);

  const handleCopy = async () => {
    if (depositAddress) {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Simulate confirmation — this would be replaced by blockchain listener
  const handleSimulateDeposit = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not signed in");

      const amountUSD = 100; // Mock deposit
      const BTC_RATE = 68000;
      const amountBTC = (amountUSD / BTC_RATE).toFixed(5);

      // Add transaction entry
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "Deposit",
        amountUSD,
        amountBTC,
        status: "Success",
        createdAt: serverTimestamp(),
      });

      // Update user balance
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balanceUSD: amountUSD + (await getCurrentBalance(user.uid)),
      });

      setSuccessMessage(`$${amountUSD} deposit confirmed!`);
    } catch (err) {
      console.error("Deposit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get latest user balance
  const getCurrentBalance = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await import("firebase/firestore").then((mod) => mod.getDoc(userRef));
    if (snap.exists()) return snap.data().balanceUSD || 0;
    return 0;
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
            boxShadow: "0 0 15px rgba(0,255,204,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#00ffcc" }}>
            Deposit Bitcoin
          </Typography>

          {loading ? (
            <CircularProgress sx={{ color: "#00ffcc", my: 4 }} />
          ) : (
            <>
              <QRCodeCanvas
                value={depositAddress}
                size={180}
                bgColor="transparent"
                fgColor="#00ffcc"
              />
              <Typography sx={{ mt: 2, mb: 1, fontSize: "0.9rem", color: "#ccc" }}>
                Send only BTC to the address below:
              </Typography>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  p: 1.2,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#00ffcc",
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                }}
              >
                {depositAddress}
                <Tooltip title="Copy address">
                  <IconButton onClick={handleCopy} size="small" sx={{ color: "#00ffcc" }}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button
                onClick={handleSimulateDeposit}
                sx={{
                  mt: 3,
                  background: "#00ffcc",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  "&:hover": { background: "#00d4aa" },
                }}
              >
                Simulate Deposit
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={copied}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ background: "#00ffcc", color: "#000" }}>
          Address copied!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ background: "#00ffcc", color: "#000" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

