import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Button,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState(
    localStorage.getItem("qfs_currency") || "USD"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSave = () => {
    if (password && password !== confirm) {
      setSnack({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    localStorage.setItem("qfs_currency", currency);
    setPassword("");
    setConfirm("");

    setSnack({
      open: true,
      message: "Settings updated successfully!",
      severity: "success",
    });
  };

  return (
    <Box sx={{ color: "#e6edf3" }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, color: "#00ffcc" }}
      >
        Settings
      </Typography>

      <Paper
        sx={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #30363d",
          borderRadius: "12px",
          p: 3,
          maxWidth: 600,
        }}
      >
        {/* Appearance */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Appearance
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                "& .MuiSwitch-thumb": { backgroundColor: "#00ffcc" },
                "& .MuiSwitch-track": {
                  backgroundColor: "rgba(0,255,204,0.3)",
                },
              }}
            />
          }
          label="Enable Dark Mode"
          sx={{ color: "#c9d1d9", mb: 3 }}
        />

        <Divider sx={{ borderColor: "#30363d", my: 3 }} />

        {/* Preferences */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Preferences
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              sx={{
                "& .MuiSwitch-thumb": { backgroundColor: "#00ffcc" },
                "& .MuiSwitch-track": {
                  backgroundColor: "rgba(0,255,204,0.3)",
                },
              }}
            />
          }
          label="Enable Notifications"
          sx={{ color: "#c9d1d9", mb: 3 }}
        />

        <Typography variant="body1" sx={{ mb: 1, color: "#c9d1d9" }}>
          Default Currency
        </Typography>
        <Select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{
            mb: 3,
            width: 200,
            color: "#e6edf3",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#30363d",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ffcc",
            },
            "& .MuiSvgIcon-root": { color: "#00ffcc" },
          }}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="GBP">GBP</MenuItem>
          <MenuItem value="BTC">BTC</MenuItem>
        </Select>

        <Divider sx={{ borderColor: "#30363d", my: 3 }} />

        {/* Security */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Security
        </Typography>

        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#30363d" },
              "&:hover fieldset": { borderColor: "#00ffcc" },
              "&.Mui-focused fieldset": { borderColor: "#00ffcc" },
            },
            "& .MuiInputLabel-root": { color: "#c9d1d9" },
            input: { color: "#e6edf3" },
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#30363d" },
              "&:hover fieldset": { borderColor: "#00ffcc" },
              "&.Mui-focused fieldset": { borderColor: "#00ffcc" },
            },
            "& .MuiInputLabel-root": { color: "#c9d1d9" },
            input: { color: "#e6edf3" },
          }}
        />

        <Button
          onClick={handleSave}
          sx={{
            mt: 1,
            background: "#00ffcc",
            color: "#000",
            fontWeight: 600,
            px: 4,
            "&:hover": { background: "#00d4aa" },
          }}
        >
          Save Settings
        </Button>
      </Paper>

      {/* Snackbar feedback */}
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

