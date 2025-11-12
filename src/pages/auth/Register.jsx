import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const { name, username, email, password, confirm } = formData;

    // Input validation
    if (!name || !username || !email || !password || !confirm) {
      setSnack({ open: true, message: "All fields are required.", severity: "error" });
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setSnack({ open: true, message: "Passwords do not match.", severity: "error" });
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // ✅ Step 2: Set display name
      await updateProfile(user, { displayName: name });

      // ✅ Step 3: Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        username,
        email,
        balance: 0,
        role: "user",
        avatar: "",
        createdAt: serverTimestamp(),
      });

      // ✅ Step 4: Save to localStorage
      localStorage.setItem("qfs_logged_in", "true");
      localStorage.setItem(
        "qfs_user",
        JSON.stringify({ uid: user.uid, name, username, email })
      );

      setSnack({
        open: true,
        message: "Registration successful! Logging you in...",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      let message = err.message;
      if (message.includes("email-already-in-use")) message = "Email already exists.";
      if (message.includes("permission")) message = "Permission error — please try again later.";
      setSnack({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
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
      <Box
        component="img"
        src="/logo.png"
        alt="CryptoBank Logo"
        sx={{ width: 250, height: 100, mb: 3, opacity: 0.9, p: 1 }}
      />

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
          align="center"
          sx={{ mb: 3, fontWeight: 600, color: "#00ffcc" }}
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderWidth: "2px",
                    borderColor: "#30363d", // subtle transparency
                  },
                  "&:hover fieldset": {
                    borderColor: "#00ffcc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ffcc",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#8b949e",
                },
                "& .MuiInputBase-input": {
                  color: "#e6edf3",
                },
              }}
           >
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm"
                type="password"
                value={formData.confirm}
                onChange={handleChange}
                margin="normal"
              />

           </Box>

          <Button
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              borderRadius: 8,
              background: "#00ffcc",
              color: "#000",
              fontWeight: 600,
              "&:hover": { background: "#00d4aa" },
            }}
          >
            {loading ? "Registering..." : "Register"}
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

