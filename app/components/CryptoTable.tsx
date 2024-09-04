import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { fetchCryptoList } from "../api/api";
import Image from "next/image";

const CryptoTable: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [starredCoins, setStarredCoins] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const data = await fetchCryptoList(page + 1, rowsPerPage);
        setCryptoList(data);
        setFilteredList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCryptoData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setFilteredList(
      cryptoList.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, cryptoList]);

  useEffect(() => {
    const savedStarredCoins = localStorage.getItem("starredCoins");
    if (savedStarredCoins) {
      setStarredCoins(new Set(JSON.parse(savedStarredCoins)));
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStarClick = (coinId: string) => {
    const updatedStarredCoins = new Set(starredCoins);

    if (updatedStarredCoins.has(coinId)) {
      updatedStarredCoins.delete(coinId);
    } else {
      updatedStarredCoins.add(coinId);
    }

    setStarredCoins(updatedStarredCoins);
    localStorage.setItem(
      "starredCoins",
      JSON.stringify(Array.from(updatedStarredCoins))
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("starredCoinsUpdated"));
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        border: "1px solid gray",
      }}
    >
      <Box sx={{ m: "16px" }}>
        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Star</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>24h Change</TableCell>
              <TableCell>24h Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((coin: any) => (
              <TableRow key={coin.id}>
                <TableCell>
                  <IconButton onClick={() => handleStarClick(coin.id)}>
                    {starredCoins.has(coin.id) ? (
                      <StarIcon color="warning" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = `/coin/${coin.id}`)}
                >
                  <Image
                    src={coin.image}
                    width={40}
                    height={40}
                    quality={100}
                    alt="Coin's Image"
                  />
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = `/coin/${coin.id}`)}
                >
                  {coin.name}
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = `/coin/${coin.id}`)}
                >
                  {coin.current_price}
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = `/coin/${coin.id}`)}
                >
                  {coin.price_change_percentage_24h}%
                </TableCell>
                <TableCell>{coin.total_volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 30, 45]}
        component="div"
        count={100}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CryptoTable;
