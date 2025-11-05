import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  CssBaseline,
  Container,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import ProfileDrawer from "../components/ProfileDrawer";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Transactions", icon: <WalletIcon />, path: "/transactions" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // ✅ Safe user loading from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("qfs_user");
      const isLoggedIn = localStorage.getItem("qfs_logged_in") === "true";

      if (!isLoggedIn) {
        navigate("/login");
        return;
      }

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse qfs_user from localStorage:", err);
      setUser(null);
      localStorage.removeItem("qfs_user"); // optional cleanup
    }
  }, [navigate]);

  // ✅ When ProfileDrawer updates user info
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("qfs_user", JSON.stringify(updatedUser));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#0d1117",
        color: "#e6edf3",
      }}
    >
      <CssBaseline />

      {/* 🌟 Top AppBar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#161b22",
          borderBottom: "1px solid #30363d",
          color: "#e6edf3",
        }}
      >
        <Toolbar>
          {/* Sidebar toggle (mobile) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, color: "#00ffcc" }}
          >
            QFS
          </Typography>

          {/* 🌐 Desktop Nav Links */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, mr: 3 }}>
            {navLinks.map((link) => (
              <Typography
                key={link.text}
                component="a"
                onClick={() => navigate(link.path)}
                sx={{
                  ml: 3,
                  cursor: "pointer",
                  textDecoration: "none",
                  color:
                    location.pathname === link.path ? "#00ffcc" : "#c9d1d9",
                  "&:hover": { color: "#00ffcc" },
                  fontWeight: 500,
                }}
              >
                {link.text}
              </Typography>
            ))}
          </Box>

          {/* 👤 User Avatar (Profile Drawer trigger) */}
          <Tooltip title={user?.name || "Profile"}>
            <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0 }}>
              <Avatar
                src={user?.avatar || ""}
                sx={{
                  bgcolor: "#00ffcc",
                  color: "#000",
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                  fontSize: "1rem",
                }}
              >
                {!user?.avatar &&
                  (user?.name?.charAt(0)?.toUpperCase() || "?")}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* 📱 Sidebar Drawer (mobile) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            bgcolor: "#161b22",
            color: "#e6edf3",
            width: 240,
            borderRight: "1px solid #30363d",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#00ffcc", fontWeight: 700 }}
          >
            QFS
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "#30363d" }} />
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.text}
                onClick={() => {
                  navigate(link.path);
                  toggleDrawer();
                }}
                selected={location.pathname === link.path}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "rgba(0,255,204,0.1)",
                    color: "#00ffcc",
                  },
                  "&:hover": {
                    bgcolor: "rgba(0,255,204,0.08)",
                  },
                }}
              >
                {link.icon}
                <ListItemText primary={link.text} sx={{ ml: 2 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 🧩 Main Page Content */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Container>

      {/* 🦶 Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#161b22",
          textAlign: "center",
          py: 2,
          borderTop: "1px solid #30363d",
          color: "#8b949e",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} CryptoBank — All rights reserved
      </Box>

      {/* 👤 Profile Drawer */}
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onUpdate={handleProfileUpdate}
        initialData={user || { name: "Guest", avatar: "" }}
      />
    </Box>
  );
}

