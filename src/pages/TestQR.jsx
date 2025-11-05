import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, Typography } from "@mui/material";

export default function TestQR() {
  const btcAddress = "bc1qexamplebtcaddress12345"; // test BTC address

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        background: "#0d1117",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Test Bitcoin QR Code
      </Typography>
      <QRCodeCanvas value={btcAddress} size={180} bgColor="#0d1117" fgColor="#00ffcc" />
      <Typography variant="body2" sx={{ mt: 2, color: "#aaa" }}>
        {btcAddress}
      </Typography>
    </Box>
  );
}

