import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirm } = formData;

    if (!username || !email || !password || !confirm) {
      setSnack({ open: true, message: "All fields are required.", severity: "error" });
      return;
    }

    if (password !== confirm) {
      setSnack({ open: true, message: "Passwords do not match.", severity: "error" });
      return;
    }

    // Save user in localStorage (simulate registration)
    const userData = { username, email, password, balance: 0, avatar: "" };
    localStorage.setItem("qfs_user", JSON.stringify(userData));
    localStorage.setItem("qfs_transactions", JSON.stringify([]));

    setSnack({ open: true, message: "Registration successful!", severity: "success" });
    
    // ✅ Mark as logged in
    localStorage.setItem("qfs_logged_in", "true");
      
    setTimeout(() => {
      navigate("/"); // redirect to dashboard
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e6edf3",
        p: 2,
        flexDirection: "column",
      }}
    >
      {/* 🔷 App Logo Section */}
      <Box
        component="img"
        src="/logo.png" // <-- place your logo in public/logo.png
        alt="CryptoBank Logo"
        sx={{
          width: 250,
          height: 100,
          mb: 3,
          opacity: 0.9,
          p: 1,
        }}
      />

      {/* 🔷 Registration Card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          bgcolor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          sx={{ mb: 3, fontWeight: 520, color: "#fffffc" }}
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#c9d1d9" } }}
            InputProps={{
              style: { color: "#e6edf3" },
            }}
            sx={{
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#30363d" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#00ffcc" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#00ffcc",
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#c9d1d9" } }}
            InputProps={{
              style: { color: "#e6edf3" },
            }}
            sx={{
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#30363d" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#00ffcc" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#00ffcc",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#c9d1d9" } }}
            InputProps={{
              style: { color: "#e6edf3" },
            }}
            sx={{
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#30363d" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#00ffcc" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#00ffcc",
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirm"
            type="password"
            value={formData.confirm}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#c9d1d9" } }}
            InputProps={{
              style: { color: "#e6edf3" },
            }}
            sx={{
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#30363d" },
              "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#00ffcc" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#00ffcc",
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            sx={{
              mt: 3,
              background: "#00ffcc",
              color: "#000",
              fontWeight: 600,
              "&:hover": { background: "#00d4aa" },
            }}
          >
            Register
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2, color: "#8b949e" }}>
          Already have an account?{" "}
          <Link
            component="button"
            onClick={() => navigate("/login")}
            sx={{ color: "#00ffcc", textDecoration: "none" }}
          >
            Login
          </Link>
        </Typography>
      </Paper>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

