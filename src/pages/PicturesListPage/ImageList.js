import LazyImage from "../../components/LazyImage";
import "./index.scss";
import { useEffect, useState } from "react";
import useRCloneClient from "hooks/useRCloneClient";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { StatusTypes } from "utils/constants";

export default function ImageList({ remote, rootPath, onImageClicked }) {
  const rCloneClient = useRCloneClient();
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus(StatusTypes.LOADING);
        setError(null);

        const data = await rCloneClient.fetchPictures(remote, rootPath);

        setStatus(StatusTypes.SUCCESS);
        setData(data);
      } catch (err) {
        setStatus(StatusTypes.ERROR);
        setError(err);
      }
    };

    fetchData();
  }, [rCloneClient, remote, rootPath]);

  if (status === StatusTypes.LOADING) {
    return null;
  }

  if (status === StatusTypes.ERROR) {
    return <div>Error! {error}</div>;
  }

  const parseImageInfo = (fileName) => {
    const year = parseInt(fileName.substring(0, 4));
    const month = parseInt(fileName.substring(4, 6));
    const day = parseInt(fileName.substring(6, 8));

    return { year, month, day };
  };

  const images = data
    .map((item) => {
      const filePath = item.Path;
      const fileName = item.Name;
      const folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
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
        selectedImages.push(images[numImagesPerRow * index + i]);
      }

      return (
        <div className="row" style={style}>
          {selectedImages.map((selectedImage) => (
            <div onClick={handleImageClicked(selectedImage)}>
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
            className="List"
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
