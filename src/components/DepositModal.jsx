import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DepositModal({ open, onClose }) {
  const [depositAddress, setDepositAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch BTC address from Firestore
  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        setLoading(true);
        setDepositAddress("");

        const docRef = doc(db, "appSettings", "globalWallet");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.btcAddress) {
            setDepositAddress(data.btcAddress);
          } else {
            console.warn("No BTC address found in globalWallet document");
          }
        } else {
          console.warn("globalWallet document not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching BTC address:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchWalletAddress();
  }, [open]);

  // Mobile-friendly copy function
  const handleCopy = async () => {
    if (!depositAddress) return;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(depositAddress);
      } catch (err) {
        fallbackCopyTextToClipboard(depositAddress);
      }
    } else {
      fallbackCopyTextToClipboard(depositAddress);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.readOnly = true;
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);

    const selection = document.getSelection();
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textArea.select();
    textArea.setSelectionRange(0, 99999); // Mobile compatibility

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textArea);

    // Restore previous selection
    if (selected) {
      selection.removeAllRanges();
      selection.addRange(selected);
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
            boxShadow: "0 0 15px rgba(0,255,204,0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#00ffcc" }}>
            Deposit Bitcoin
          </Typography>

          {loading ? (
            <CircularProgress sx={{ color: "#00ffcc", my: 4 }} />
          ) : depositAddress ? (
            <>
              <QRCodeCanvas
                value={depositAddress}
                size={180}
                bgColor="transparent"
                fgColor="#00ffcc"
              />

              <Typography sx={{ mt: 2, mb: 1, fontSize: "0.9rem", color: "#ff3b3b" }}>
                Send only Bitcoin to the address below:
              </Typography>

              <Box
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  p: 1.5,
                  borderRadius: "8px",
                  color: "#00ffcc",
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                  mb: 2,
                }}
              >
                {depositAddress}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={handleCopy}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    background: "rgba(0,255,204,0.1)",
                    color: "#00ffcc",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    "&:hover": { background: "rgba(0,255,204,0.2)" },
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                  Copy Address
                </Button>
              </Box>
            </>
          ) : (
            <Typography sx={{ color: "#ff6b6b", mt: 2 }}>
              No deposit address configured.
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Snackbar for copy */}
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ background: "#00ffcc", color: "#000" }}>
          Address copied!
        </Alert>
      </Snackbar>
    </>
  );
}

