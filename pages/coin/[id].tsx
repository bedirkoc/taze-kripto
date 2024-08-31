import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  fetchCoinData,
  fetchCoinMarketChart,
  fetchCryptoNewsinCoins,
} from "@/app/api/api";
import { Box, Typography, Paper, Button } from "@mui/material";
import Image from "next/image";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Navbar from "@/app/components/Navbar";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    low_24h: { usd: number };
    high_24h: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
  description: { en: string };
}

const timeFrames = ["1", "7", "30", "365"]; 

const CoinPage = () => {
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<any>({});
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("1");
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const coinData = await fetchCoinData(id as string);
          setCoin(coinData);

          const marketChart = await fetchCoinMarketChart(
            id as string,
            "usd",
            selectedTimeFrame
          );          
          const dataLimit =
            selectedTimeFrame === "1"
              ? 10
              : selectedTimeFrame === "7"
              ? 30
              : marketChart.length;
          const limitedData = marketChart.slice(-dataLimit);

          const formattedData = limitedData.map(
            ([timestamp, open, high, low, close]: [
              number,
              number,
              number,
              number,
              number
            ]) => {
              return {
                x: new Date(timestamp).toLocaleString(),
                y: [open, high, low, close],
              };
            }
          );

          setChartData({
            series: [
              {
                name: "Price",
                data: formattedData,
              },
            ],
            options: {
              chart: {
                type: "candlestick",
                height: 350,
                animations: {
                  enabled: false, 
                },
              },
              xaxis: {
                type: "datetime",
                labels: {
                  format: "dd MMM HH:mm", 
                },
              },
              yaxis: {
                title: {
                  text: "Price (USD)",
                },
              },
              plotOptions: {
                candlestick: {
                  colors: {
                    upward: "#00B746",
                    downward: "#EF403C",
                  },
                  wick: {
                    useFillColor: true,
                  },
                },
              },
              tooltip: {
                x: {
                  format: "dd MMM yyyy HH:mm", 
                },
              },
            },
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [id, selectedTimeFrame]);

  useEffect(() => {
    const getNews = async () => {
      if (typeof coin?.name === "string") {
        try {
          const data = await fetchCryptoNewsinCoins(coin?.name);
          setNews(data.slice(0, 10)); 
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
        }
      }
    };

    if (coin?.name) {
      getNews();
    }
  }, [coin?.name]);

  if (!coin) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Navbar />

      <Box
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Image
          src={coin.image.large}
          width={200}
          height={200}
          quality={100}
          alt="Coin's Image"
        />
        <Typography variant="h4" gutterBottom>
          {coin.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 1, md: 10 },
            boxShadow:
              " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            borderRadius: "16px",
          }}
        >
          <Box sx={{ m: 2 }}>
            <Typography variant="h6" color="gray">
              Current Price:
            </Typography>
            <Typography variant="body1">
              ${coin.market_data.current_price.usd.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ m: 2 }}>
            <Typography variant="h6" color="gray">
              Price Change (24h):{" "}
            </Typography>
            <Typography variant="body1">
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </Typography>
          </Box>
          <Box sx={{ m: 2 }}>
            <Typography variant="h6" color="gray">
              Market Cap:
            </Typography>
            <Typography variant="body2">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mt: 2 }}>
          <Box
            sx={{
              boxShadow:
                " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowDropUpIcon
              sx={{
                color: "red",
                width: "50px",
                height: "50px",
                rotate: "180deg",
                mb: 1,
              }}
            />
            <Typography variant="h6" color="gray">
              24h Low:
            </Typography>
            <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
              ${coin.market_data.low_24h.usd.toFixed(2)}
            </Typography>
          </Box>
          <Box
            sx={{
              boxShadow:
                " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowDropUpIcon
              sx={{
                color: "green",
                width: "50px",
                height: "50px",
                mb: 1,
              }}
            />
            <Typography variant="h6" color="gray">
              24h High:
            </Typography>
            <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
              ${coin.market_data.high_24h.usd.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ m: 2 }}>
          {coin.description.en}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Paper sx={{ padding: 2, marginTop: 3, width: "60%" }}>
            <Typography variant="h5" gutterBottom>
              Price Chart
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              {timeFrames.map((timeFrame) => (
                <Button
                  key={timeFrame}
                  onClick={() => setSelectedTimeFrame(timeFrame)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor:
                      selectedTimeFrame === timeFrame ? "#0070f3" : "#e0e0e0",
                    color: selectedTimeFrame === timeFrame ? "#fff" : "#000",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {timeFrame}d
                </Button>
              ))}
            </Box>
            {chartData.series ? (
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="candlestick"
                height={350}
              />
            ) : (
              <Typography>
                No data available for selected time frame.
              </Typography>
            )}
          </Paper>
        </Box>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
         {coin?.name} News
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {news.map((article, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              )}
              <div style={{ padding: "15px" }}>
                <h2 style={{ fontSize: "1.2rem", margin: "0 0 10px" }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  {article.description}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0070f3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
};

export default CoinPage;
