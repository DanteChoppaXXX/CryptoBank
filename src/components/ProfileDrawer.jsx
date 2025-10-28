import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function ProfileDrawer({ open, onClose, onUpdate, initialData }) {
  const [user, setUser] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setUser(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSnack({
        open: true,
        message: "Please upload a valid image file.",
        severity: "error",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedUser = { ...user, avatar: event.target.result };
      setUser(updatedUser);
      localStorage.setItem("qfs_user", JSON.stringify(updatedUser));
      onUpdate(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setEditMode(false);
    localStorage.setItem("qfs_user", JSON.stringify(user));
    onUpdate(user);
    setSnack({
      open: true,
      message: "Profile updated successfully!",
      severity: "success",
    });
  };

  const handleCancel = () => setEditMode(false);

  // --- 🧹 Sign Out Handler ---
  const handleSignOut = () => {
    localStorage.removeItem("qfs_user");
    const defaultUser = { name: "John Doe", avatar: "" };
    onUpdate(defaultUser);
    setSnack({
      open: true,
      message: "You have been signed out.",
      severity: "info",
    });
    setTimeout(() => {
      onClose();
      navigate("/login"); // redirect to login page if available
    }, 1200);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 380 },
            bgcolor: "#161b22",
            color: "#e6edf3",
            borderLeft: "1px solid #30363d",
            boxShadow: "0 0 20px rgba(0,255,204,0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #30363d",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#00ffcc" }}>
            User Profile
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={user.avatar || ""}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                bgcolor: "#00ffcc",
                color: "#000",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {!user.avatar && user.name.charAt(0)}
            </Avatar>

            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "#00ffcc",
                      color: "#000",
                      "&:hover": { bgcolor: "#00d4aa" },
                      width: 36,
                      height: 36,
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </label>
              </>
            )}
          </Box>

          {!editMode ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#8b949e", mt: 0.5, mb: 1 }}
              >
                @{user.username || "username"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {user.bio || "No bio yet"}
              </Typography>

              <Divider sx={{ width: "100%", mb: 2, borderColor: "#30363d" }} />

              <Typography variant="body2" sx={{ color: "#c9d1d9", mb: 1 }}>
                Email: <b>{user.email || "Not set"}</b>
              </Typography>

              <Button
                onClick={() => setEditMode(true)}
                sx={{
                  mt: 2,
                  background: "#00ffcc",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 4,
                  "&:hover": { background: "#00d4aa" },
                }}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Full Name"
                fullWidth
                variant="outlined"
                value={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
                sx={textFieldStyle}
              />
              <TextField
                label="Username"
                fullWidth
                variant="outlined"
                value={user.username || ""}
                onChange={(e) => handleChange("username", e.target.value)}
                sx={textFieldStyle}
              />
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                value={user.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                sx={textFieldStyle}
              />
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={user.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                sx={textFieldStyle}
              />

              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button
                  onClick={handleCancel}
                  fullWidth
                  sx={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { background: "rgba(255,255,255,0.15)" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  fullWidth
                  sx={{
                    background: "#00ffcc",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": { background: "#00d4aa" },
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* --- Sign Out Section --- */}
        <Box
          sx={{
            borderTop: "1px solid #30363d",
            p: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{
              background: "rgba(255,255,255,0.08)",
              color: "#ff6b6b",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                background: "rgba(255,255,255,0.15)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          sx={{
            background: "rgba(0,255,204,0.1)",
            border: "1px solid #00ffcc",
            color: "#00ffcc",
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// Shared TextField styling
const textFieldStyle = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#30363d" },
    "&:hover fieldset": { borderColor: "#00ffcc" },
    "&.Mui-focused fieldset": { borderColor: "#00ffcc" },
  },
  input: { color: "#e6edf3" },
  label: { color: "#8b949e" },
  textarea: { color: "#e6edf3" },
};

