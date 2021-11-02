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

        const imageBlob = await rCloneClient.fetchFileContents(
          image.remote,
          image.folderPath,
          image.fileName
        );

        const imageUrl = URL.createObjectURL(new Blob([imageBlob]));
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

  if (!imageUrl) {
    return (
      <Skeleton
        variant="rectangular"
        className={cx('image', skeletonClassName)}
        width={width}
        height={height}
      />
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
