"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Box, Typography } from "@mui/material";

const DynamicCryptoTable = dynamic(() => import("./components/CryptoTable"), {
  ssr: false,
});
const DynamicNavbar = dynamic(() => import("./components/Navbar"), {
  ssr: false,
});
const DynamicStarredCoinSlider = dynamic(
  () => import("./components/StarredCoinSlider"),
  {
    ssr: false,
  }
);
const DynamicCryptoNews = dynamic(() => import("./components/CryptoNews"), {
  ssr: false,
});

const Home = () => {
  return (
    <div>
      <DynamicNavbar />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <DynamicStarredCoinSlider />
          <Typography variant="h5" sx={{ mt: 5 }}>
            Kripto Listesi
          </Typography>
          <DynamicCryptoTable />
          <DynamicCryptoNews />
        </Box>
      </Box>
    </div>
  );
};

export default Home;
