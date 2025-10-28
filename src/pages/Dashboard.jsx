import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Modal,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTransactions } from "../context/TransactionContext";

export default function Dashboard() {
  // --- GLOBAL STATE FROM CONTEXT ---
  const { balanceUSD, transactions, addTransaction } = useTransactions();

  // --- LOCAL UI STATES ---
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("deposit"); // "deposit" | "withdraw"
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "" });

  const balanceBTC = (balanceUSD / 68000).toFixed(4); // Example BTC rate

  // --- SLIDER DATA ---
  const newsSlides = [
    {
      title: "Bitcoin hits $68,000 as ETF inflows surge",
      img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      title: "Crypto adoption in Africa grows 20% this quarter",
      img: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      title: "Institutional investors eye BTC long positions again",
      img: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: true,
  };

  // --- HANDLERS ---
  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
    setAmount("");
    setError(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError(false);
    setTooltipText("");
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      setError(true);
      setTooltipText("Please enter a valid amount.");
      return;
    }

    if (modalType === "withdraw" && value > balanceUSD) {
      setError(true);
      setTooltipText("Insufficient balance.");
      return;
    }

    // Update global state and save persistently
    addTransaction(modalType, value);

    handleCloseModal();
    setSnack({
      open: true,
      message: `Successfully ${modalType}ed $${value.toFixed(2)}`,
      severity: "success",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Balance Card */}
      <Card
        sx={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #30363d",
          borderRadius: "12px",
          p: 3,
          backdropFilter: "blur(6px)",
          transition: "0.2s",
          "&:hover": { transform: "translateY(-3px)" },
          maxWidth: 420,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ color: "#00ffcc", mb: 1, fontWeight: 600 }}
          >
            Total Balance
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ${balanceUSD.toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#8b949e", mt: 0.5 }}>
            ≈ {balanceBTC} BTC
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ mt: 3 }}>
            <Button
              onClick={() => handleOpenModal("deposit")}
              sx={{
                background: "#00ffcc",
                color: "#000",
                borderRadius: "8px",
                px: 3,
                py: 1,
                mr: 2,
                fontWeight: 600,
                "&:hover": { background: "#00d4aa" },
              }}
            >
              Deposit
            </Button>
            <Button
              onClick={() => handleOpenModal("withdraw")}
              sx={{
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 600,
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              Withdraw
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table (shows only latest 5) */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Transactions
        </Typography>

        <Paper
          sx={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid #30363d",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead
              sx={{ background: "rgba(255,255,255,0.08)", color: "#e6edf3" }}
            >
              <TableRow>
                <TableCell sx={{ color: "#c9d1d9" }}>Type</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Amount (USD)</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Amount (BTC)</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>${tx.amountUSD}</TableCell>
                  <TableCell>{tx.amountBTC}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color:
                          tx.status === "Success" ? "#00ff80" : "#ffee58",
                        background:
                          tx.status === "Success"
                            ? "rgba(0,255,128,0.15)"
                            : "rgba(255,255,0,0.15)",
                      }}
                    >
                      {tx.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Slideshow Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Bitcoin News
        </Typography>

        <Slider {...sliderSettings}>
          {newsSlides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #30363d",
                borderRadius: "12px",
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 3,
                minHeight: 120,
              }}
            >
              <Typography variant="subtitle1" sx={{ flex: 1 }}>
                {slide.title}
              </Typography>
              <Box
                component="img"
                src={slide.img}
                alt={slide.title}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                  opacity: 0.8,
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Deposit / Withdraw Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "12px",
            p: 4,
            width: "90%",
            maxWidth: 400,
            boxShadow: "0 0 15px rgba(0,255,204,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#00ffcc",
              mb: 2,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {modalType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
          </Typography>

          <Tooltip
            open={error}
            title={tooltipText}
            placement="top"
            arrow
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                sx: {
                  color: "#e6edf3",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                },
              }}
              InputLabelProps={{
                style: { color: "#c9d1d9" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#30363d" },
                  "&:hover fieldset": { borderColor: "#00ffcc" },
                  "&.Mui-focused fieldset": { borderColor: "#00ffcc" },
                },
              }}
            />
          </Tooltip>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              onClick={handleCloseModal}
              sx={{
                flex: 1,
                mr: 1,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 600,
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{
                flex: 1,
                ml: 1,
                background: "#00ffcc",
                color: "#000",
                fontWeight: 600,
                "&:hover": { background: "#00d4aa" },
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

