import Skeleton from '@mui/material/Skeleton';
import cx from 'classnames';
import PropTypes from 'prop-types';
import useFetchImage from 'hooks/fetch-data/useFetchImage';
import { StatusTypes } from 'utils/constants';
import './index.scss';

export default function Image({ image, width, height, imgClassName, skeletonClassName }) {
  const { status, data: imageUrl, error } = useFetchImage(image);

  if (status === StatusTypes.LOADING) {
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

  if (status === StatusTypes.ERROR) {
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

Image.propTypes = {
  image: PropTypes.shape({
    remote: PropTypes.string,
    dirPath: PropTypes.string,
    fileName: PropTypes.string,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  imgClassName: PropTypes.string,
  skeletonClassName: PropTypes.string,
};
