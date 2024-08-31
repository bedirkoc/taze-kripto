import axios from 'axios';

export const fetchCryptoList = async (page: number = 1, perPage: number = 5) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets`;
  const options = {
    params: {
      vs_currency: 'usd',
      per_page: perPage,
      page: page
    },
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY 
    }
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto list:', error);
    throw error;
  }
};


export const fetchWatchlistData = async (starredCoinIds: string[]) => {
    const url = `https://api.coingecko.com/api/v3/coins/markets`;
    const options = {
      params: {
        vs_currency: 'usd',
        ids: starredCoinIds.join(',') 
      },
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY 
      }
    };
  
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
      throw error;
    }
  }


  export const fetchCoinData = async (id: string) => {
    const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false`;
    const options = {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY ,
      },
    };
  
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      throw error;
    }
  };
  
  export const fetchCoinMarketChart = async (id: string, vs_currency: string, days: string) => {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc`;
    const options = {
      params: {
        vs_currency,
        days,
      },
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY ,
      },
    };
  
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error('Error fetching coin market chart data:', error);
      throw error;
    }
  };


  export const fetchCryptoNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'cryptocurrency',
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
        }
      });
      return response.data.articles;
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      throw error;
    }
  };


  export const fetchCryptoNewsinCoins = async (query: string) => {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query, 
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
        }
      });
      return response.data.articles;
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      throw error;
    }
  };