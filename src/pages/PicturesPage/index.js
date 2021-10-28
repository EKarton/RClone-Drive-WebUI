import LazyImage from "./LazyImage";
import "./index.scss";
import { useEffect, useState } from "react";
import useRCloneClient from "hooks/useRCloneClient";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

const StatusTypes = Object.freeze({
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

const PicturesPage = ({ remote, rootPath }) => {
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
        setData(data.slice(0, 100));
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

  const renderCell =
    (width, height, numImagesPerRow) =>
    ({ index, style }) => {
      const image = images[index];

      return (
        <div style={style}>
          <LazyImage image={image} width={200} height={200} />
        </div>
      );
    };

  return (
    <AutoSizer>
      {({ height, width }) => {
        const imgWidth = width / 5;
        const imgHeight = imgWidth;

        return (
          <FixedSizeList
            className="List"
            width={width}
            height={height}
            itemCount={images.length}
            itemSize={200}
          >
            {renderCell(imgWidth, imgHeight, 5)}
          </FixedSizeList>
        );
      }}
    </AutoSizer>
  );
};

PicturesPage.defaultProps = {
  remote: "googledrive-main-encrypted",
  rootPath: "Pictures",
};

export default PicturesPage;
