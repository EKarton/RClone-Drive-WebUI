import { useEffect, useState } from 'react';
import useRCloneClient from 'hooks/useRCloneClient';
import { Skeleton } from '@mui/material';
import cx from 'classnames';
import './Image.scss';

export default function Image({ image, width, height, imgClassName, skeletonClassName }) {
  const rCloneClient = useRCloneClient();
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(undefined);
        setImageUrl(undefined);

        const response = await rCloneClient.fetchImage(
          image.remote,
          image.folderPath,
          image.fileName
        );

        const imageUrl = URL.createObjectURL(await response.blob());
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
  }, [image, imageUrl, rCloneClient]);

  if (!imageUrl && !error) {
    return (
      <Skeleton
        variant="rectangular"
        className={cx('image', skeletonClassName)}
        width={width}
        height={height}
      />
    );
  }

  if (error) {
    return (
      <div width={width} height={height}>
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
    />
  );
}
