import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BaseErrorPage from './BaseErrorPage';

export default function InternalErrorPage({ error }) {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const fetchDogPictures = async () => {
      const { data } = await axios.get('https://api.thecatapi.com/v1/images/search');
      const pictureUrl = data[0].url;

      setImageUrl(pictureUrl);
    };

    fetchDogPictures();
  }, []);

  const handleButtonClick = () => {
    window.location.reload();
  };

  const renderButton = () => {
    return (
      <Button variant="outlined" onClick={handleButtonClick}>
        Refresh the page
      </Button>
    );
  };

  return (
    <BaseErrorPage
      error={error}
      imageUrl={imageUrl}
      title="Sorry!"
      subtitle="Something went wrong on our end. Please try again later"
      button={renderButton()}
    />
  );
}
