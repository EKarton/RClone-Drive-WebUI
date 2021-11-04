import LazyImage from '../../components/LazyImage';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import './ImageList.scss';

export default function ImageList({ images, remote, onImageClicked }) {
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
      const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
      const dateTaken = parseImageInfo(fileName);

      return { remote, folderPath, fileName, dateTaken };
    })
    .sort((image1, image2) => image2.fileName.localeCompare(image1.fileName));

  const handleImageClicked = (image) => () => {
    onImageClicked(image);
  };

  const renderCell =
    (width, height, numImagesPerRow) =>
    ({ index, style }) => {
      const selectedImages = [];

      for (let i = 0; i < numImagesPerRow; i++) {
        selectedImages.push(parsedImages[numImagesPerRow * index + i]);
      }

      return (
        <div className="imagelist__row" style={style}>
          {selectedImages.map((selectedImage) => (
            <div key={selectedImage.fileName} onClick={handleImageClicked(selectedImage)}>
              <LazyImage image={selectedImage} width={width} height={height} />
            </div>
          ))}
        </div>
      );
    };

  return (
    <AutoSizer>
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
