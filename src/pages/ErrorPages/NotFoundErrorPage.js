import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BaseErrorPage from './BaseErrorPage';

export default function NotFoundErrorPage({ error, redirectText, redirectLink }) {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const fetchDogPictures = async () => {
      const { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      const pictureUrl = data.message;

      setImageUrl(pictureUrl);
    };

    fetchDogPictures();
  }, []);

  const renderButton = () => {
    return (
      <Button variant="outlined" component={Link} to={redirectLink}>
        {redirectText}
      </Button>
    );
  };

  return (
    <BaseErrorPage
      error={error}
      imageUrl={imageUrl}
      title="Sorry!"
      subtitle="This item might not exist or is no longer available"
      button={renderButton()}
    />
  );
}
