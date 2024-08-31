"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import CryptoTable from "./components/CryptoTable";
import Navbar from "./components/Navbar";
import CryptoNews from "./components/CryptoNews";
import StarredCoinsSlider from "./components/StarredCoinSlider";

const Home = () => {
  return (
    <div>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <StarredCoinsSlider />
          <Typography variant="h5" sx={{ mt: 5 }}>
            Kripto Listesi
          </Typography>
          <CryptoTable />
          <CryptoNews />
        </Box>
      </Box>
    </div>
  );
};

export default Home;
