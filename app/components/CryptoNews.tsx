import { useEffect, useState } from 'react';
import { fetchCryptoNews } from '@/app/api/api';
import { Box, Button, Typography } from '@mui/material';

const CryptoNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchCryptoNews();
        setNews(data.slice(0, 10)); 
      } catch (err) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant='h1' style={{ textAlign: 'center', marginBottom: '20px' }}>Crypto News</Typography>
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {news.map((article, index) => (
          <Box key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
            )}
            <Box style={{ padding: '15px' }}>
              <Typography variant='h2' style={{ fontSize: '1.2rem', margin: '0 0 10px' }}>{article.title}</Typography>
              <Typography variant='body2' style={{ fontSize: '0.9rem', color: '#555' }}>{article.description}</Typography>
              <Button href={article.url} target="_blank" rel="" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>Read more</Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CryptoNews;
