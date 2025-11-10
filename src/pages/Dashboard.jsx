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
  CircularProgress,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ Import modal components
import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";

// ✅ Use TransactionContext
import { useTransactions } from "../context/TransactionContext";

export default function Dashboard() {
  const { balanceUSD, transactions, loading } = useTransactions();
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const BTC_RATE = 68000;
  const balanceBTC = (balanceUSD / BTC_RATE).toFixed(4);

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

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#00ffcc" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* BALANCE CARD */}
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
          <Typography variant="h6" sx={{ color: "#00ffcc", mb: 1, fontWeight: 600 }}>
            Total Balance
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ${balanceUSD.toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#8b949e", mt: 0.5 }}>
            ≈ {balanceBTC} BTC
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              onClick={() => setOpenDeposit(true)}
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
              onClick={() => setOpenWithdraw(true)}
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

      {/* TRANSACTIONS TABLE */}
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
            <TableHead sx={{ background: "rgba(255,255,255,0.08)" }}>
              <TableRow>
                <TableCell sx={{ color: "#c9d1d9" }}>Type</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Amount (USD)</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Amount (BTC)</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
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
                          color: tx.status === "Success" ? "#00ff80" : "#ffee58",
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#8b949e", py: 3 }}>
                    No transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* NEWS SLIDER */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Bitcoin News
        </Typography>
        <Slider {...sliderSettings}>
          {newsSlides.map((slide, i) => (
            <Box
              key={i}
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
                sx={{ width: 60, height: 60, objectFit: "contain", opacity: 0.8 }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* MODALS */}
      <DepositModal open={openDeposit} onClose={() => setOpenDeposit(false)} />
      <WithdrawModal open={openWithdraw} onClose={() => setOpenWithdraw(false)} />
    </Box>
  );
}

