import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import cx from 'classnames';
import './Image.scss';
import useImageFetcher from 'hooks/useImageFetcher';

export default function Image({ image, width, height, imgClassName, skeletonClassName }) {
  const imageFetcher = useImageFetcher();
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(undefined);
        setImageUrl(undefined);

        const response = await imageFetcher.getImage(
          image.remote,
          image.folderPath,
          image.fileName
        );

        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setImageUrl(imageUrl);
      } catch (error) {
        setError(error);
      }
    };

    if (!imageUrl && image) {
      fetchData();
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image, imageUrl, imageFetcher]);

  if (!imageUrl && !error) {
    return (
      <Skeleton
        variant="rectangular"
        className={cx('image', skeletonClassName)}
        width={width}
        height={height}
        data-testid="image-spinner"
      />
    );
  }

  if (error) {
    return (
      <div width={width} height={height} data-testid="image-error">
        Error: {error.message}
      </div>
    );
  }

  return (
    <img
      className={cx('image', imgClassName)}
      src={imageUrl}
      alt={image.fileName}
      loading="lazy"
      width={width}
      height={height}
      data-testid="image-content"
    />
  );
}
