import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import LazyImage from 'components/LazyImage';
import './index.scss';

export default function LazyImageList({ images, remote, onImageClicked, ...otherProps }) {
  const parseImageInfo = (fileName) => {
    const year = parseInt(fileName.substring(0, 4));
    const month = parseInt(fileName.substring(4, 6));
    const day = parseInt(fileName.substring(6, 8));

    return { year, month, day };
  };

  const parsedImages = images
    .map((item) => {
      const filePath = item.Path;
      const fileName = item.Name;
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      const dateTaken = parseImageInfo(fileName);

      return { remote, dirPath, fileName, dateTaken };
    })
    .sort((image1, image2) => image2.fileName.localeCompare(image1.fileName));

  const handleImageClicked = (image) => () => {
    onImageClicked(image);
  };

  const renderCell =
    (width, height, numImagesPerRow) =>
    ({ index, style }) => {
      const selectedImages = [];

      let i = 0;
      while (i < numImagesPerRow && numImagesPerRow * index + i < parsedImages.length) {
        selectedImages.push(parsedImages[numImagesPerRow * index + i]);
        i += 1;
      }

      return (
        <div className="imagelist__row" style={style}>
          {selectedImages.map((selectedImage) => (
            <div
              key={selectedImage.fileName}
              onClick={handleImageClicked(selectedImage)}
              data-testid={selectedImage.fileName}
            >
              <LazyImage image={selectedImage} width={width} height={height} />
            </div>
          ))}
        </div>
      );
    };

  return (
    <AutoSizer {...otherProps}>
      {({ height, width }) => {
        const numImagesPerRow = width < 1920 ? 3 : 5;
        const imgWidth = Math.floor(width / numImagesPerRow);
        const imgHeight = imgWidth;

        const numRows = Math.ceil(images.length / numImagesPerRow);

        return (
          <FixedSizeList
            width={width}
            height={height}
            itemCount={numRows}
            itemSize={imgHeight}
          >
            {renderCell(imgWidth, imgHeight, numImagesPerRow)}
          </FixedSizeList>
        );
      }}
    </AutoSizer>
  );
}

LazyImageList.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      Path: PropTypes.string,
      Name: PropTypes.string,
    })
  ),
  remote: PropTypes.shape,
  onImageClicked: PropTypes.func,
};
