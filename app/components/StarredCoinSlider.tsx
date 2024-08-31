import React, {useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { fetchCoinData, fetchCoinMarketChart } from "@/app/api/api"; 
import { EmblaOptionsType } from "embla-carousel";
import { Box } from "@mui/material";
import Chart from "react-apexcharts"; 

type PropType = {
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      ...options,
      loop: true,
      slidesToScroll: 1,
    },
    [AutoScroll({ playOnInit: true })]
  );
  const [slides, setSlides] = useState<any[]>([]);
  const [starredCoins, setStarredCoins] = useState<Set<string>>(new Set());
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchWatchlistData = async (coinIds: string[]) => {
    try {
      const dataPromises = coinIds.map((id) => fetchCoinData(id));
      const dataResponses = await Promise.all(dataPromises);
      return dataResponses;
    } catch (error) {
      console.error("Error fetching watchlist data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchWatchlistDataFromLocalStorage = async () => {
      const savedStarredCoins = localStorage.getItem("starredCoins");
      if (savedStarredCoins) {
        const starredCoinIds = JSON.parse(savedStarredCoins);
        setStarredCoins(new Set(starredCoinIds));

        try {
          const data = await fetchWatchlistData(starredCoinIds);
          setSlides(data);

          const marketChartPromises = starredCoinIds.map((id: string) =>
            fetchCoinMarketChart(id, "usd", "1")
          );
          const marketCharts = await Promise.all(marketChartPromises);

          const formattedCharts = marketCharts.map((marketChart) => {
            const formattedData = marketChart
              .slice(-10)
              .map(
                ([timestamp, open, high, low, close]: [
                  number,
                  number,
                  number,
                  number,
                  number
                ]) => ({
                  x: new Date(timestamp).toLocaleString(),
                  y: [open, high, low, close],
                })
              );
            return {
              series: [
                {
                  name: "Price",
                  data: formattedData,
                },
              ],
              options: {
                chart: {
                  type: "candlestick",
                  height: 150, 
                  toolbar: {
                    show: false, 
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
            };
          });

          setChartData(formattedCharts);
        } catch (error) {
          console.error("Error fetching watchlist data:", error);
        }
      }
    };

    fetchWatchlistDataFromLocalStorage();

    const handleStorageChange = () => {
      fetchWatchlistDataFromLocalStorage();
    };

    window.addEventListener("starredCoinsUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("starredCoinsUpdated", handleStorageChange);
    };
  }, []);

  return (
    <Box sx={{ mt: 1 }} className="embla">
      <Box className="embla__viewport" ref={emblaRef}>
        <Box className="embla__container">
          {slides.map((slide, index) => (
            <Box
              className="embla__slide"
              key={slide.id}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = `/coin/${slide.id}`)}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column" }}
                className="embla__slide__content"
              >
                <Box className="embla__slide__image">
                  <Image
                    src={slide.image.large}
                    alt={slide.name}
                    width={50}
                    height={50}
                  />
                </Box>
                <p>${slide.market_data.current_price.usd.toFixed(2)}</p>
                <Box className="embla__slide__info">
                  {chartData[index] && (
                    <Chart
                      options={chartData[index].options}
                      series={chartData[index].series}
                      type="candlestick"
                      height={100}
                      width={150}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EmblaCarousel;
