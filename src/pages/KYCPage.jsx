import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const COLORS = {
  primary: "#0FFF95",
  background: "#0d1117",
  card: "#111516",
  text: "#FFFFFF",
  border: "#1F2A2F",
};

export default function KYCPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    licenseFront: null,
    licenseBack: null,
  });

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "licenseFront") {
      setPreviewFront(URL.createObjectURL(file));
    } else {
      setPreviewBack(URL.createObjectURL(file));
    }

    setFormData({ ...formData, [e.target.name]: file });
  };

  // Validate all fields
  const allFieldsFilled = () =>
    Object.values(formData).every((val) => val !== "" && val !== null);

  const handleSubmit = async () => {
    if (!allFieldsFilled()) {
      alert("Please complete all fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Convert files to Base64
      const encodeFile = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const frontImg = await encodeFile(formData.licenseFront);
      const backImg = await encodeFile(formData.licenseBack);

      const userRef = doc(db, "users", user.uid);

      // Write KYC object to the user document
      await updateDoc(userRef, {
        kyc: {
          status: "submitted",
          fullname: formData.fullname,
          dob: formData.dob,
          ssn: formData.ssn,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          licenseFront: frontImg,
          licenseBack: backImg,
          submittedAt: Date.now(),
        },
      });

      alert("KYC Submitted Successfully!");

      navigate("/"); // Go home after submission
    } catch (error) {
      console.error(error);
      alert("Error submitting KYC.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.background,
        color: COLORS.text,
        pb: 10,
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 700 }}>
          Identity Verification
        </Typography>
        <Typography sx={{ opacity: 0.7, mt: 1 }}>
          Please fill all fields to complete your verification.
        </Typography>
      </Box>

      {/* FORM */}
      <Box sx={{ px: 3 }}>
        <Grid container spacing={2}>
          {/* Full Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="fullname"
              label="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Street Address"
              value={formData.address}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* State */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formData.state}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* ZIP */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="zip"
              label="Zip Code"
              value={formData.zip}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* SSN */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="ssn"
              label="SSN / National ID"
              value={formData.ssn}
              onChange={handleChange}
              InputLabelProps={{ style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              name="dob"
              label="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true, style: { color: COLORS.text } }}
              sx={{
                input: { color: COLORS.text, py: 1.5 },
                bgcolor: COLORS.card,
                borderRadius: "12px",
              }}
            />
          </Grid>

          {/* LICENSE UPLOAD */}
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 700, mt: 2 }}>
              Driver’s License
            </Typography>
            <Typography sx={{ opacity: 0.6, mb: 1 }}>
              Upload front and back images.
            </Typography>
          </Grid>

          {/* FRONT */}
          <Grid item xs={12}>
            <Button
              fullWidth
              component="label"
              sx={{
                bgcolor: COLORS.card,
                color: COLORS.text,
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                py: 1.5,
                flexDirection: "column",
              }}
            >
              Upload Front
              {previewFront && (
                <img
                  src={previewFront}
                  alt="front preview"
                  style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
                />
              )}
              <input
                type="file"
                name="licenseFront"
                hidden
                onChange={handleFile}
              />
            </Button>
          </Grid>

          {/* BACK */}
          <Grid item xs={12}>
            <Button
              fullWidth
              component="label"
              sx={{
                bgcolor: COLORS.card,
                color: COLORS.text,
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                py: 1.5,
                flexDirection: "column",
              }}
            >
              Upload Back
              {previewBack && (
                <img
                  src={previewBack}
                  alt="back preview"
                  style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
                />
              )}
              <input
                type="file"
                name="licenseBack"
                hidden
                onChange={handleFile}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* SUBMIT BUTTON STICKY */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 3,
          bgcolor: COLORS.card,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <Button
          fullWidth
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            bgcolor: COLORS.primary,
            color: COLORS.background,
            py: 1.7,
            borderRadius: "12px",
            fontWeight: 700,
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Submit Verification"}
        </Button>
      </Box>
    </Box>
  );
}

