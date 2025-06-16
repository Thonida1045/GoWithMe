import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataFetcher: React.FC = () => {
  const [data, setData] = useState<any>(null); // State to store the fetched data
  const [error, setError] = useState<string>(''); // State for any errors

  // Fetch data on component mount
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/data') // Ensure this URL points to your Laravel backend API endpoint
      .then((response) => {
        setData(response.data); // Set fetched data
      })
      .catch((error) => {
        setError('Error fetching data'); // Set error message if request fails
        console.error('Error:', error);
      });
  }, []); // Empty dependency array means it runs only once when the component mounts

  return (
    <div>
      <h1>Fetched Data from Laravel API</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DataFetcher;
