import { Skeleton } from "@mui/material";
import useRCloneClient from "hooks/useRCloneClient";
import { useEffect, useState } from "react";
import Image from "./Image";
import { useInView } from "react-intersection-observer";
import "./LazyImage.scss";

const LazyImage = ({ remote, folderPath, fileName }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "0px",
  });

  const [height, setHeight] = useState("200px");

  const rCloneClient = useRCloneClient();
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(undefined);
        setImageUrl(undefined);

        const imageBlob = await rCloneClient.fetchFileContents(
          remote,
          folderPath,
          fileName
        );

        const imageUrl = window.URL.createObjectURL(new Blob([imageBlob]));
        setImageUrl(imageUrl);
      } catch (error) {
        setError(error);
      }
    };

    if (inView && !imageUrl) {
      fetchData();
    }
  }, [fileName, folderPath, imageUrl, inView, rCloneClient, remote]);

  const reAdjustContainerHeight = (imgElement) => {
    const renderedImgWidth = imgElement.clientWidth;
    const actualImgWidth = imgElement.naturalWidth;
    const actualImgHeight = imgElement.naturalHeight;

    const aspectRatio = actualImgHeight / actualImgWidth;

    setHeight(renderedImgWidth * aspectRatio);
  };

  const handleImageResized = (e) => {
    reAdjustContainerHeight(e?.current);
  };

  const handleImageLoaded = (e) => {
    reAdjustContainerHeight(e?.target);
  };

  const renderContent = () => {
    if (error) {
      return <div>Error! {error.message}</div>;
    }

    if (!imageUrl) {
      return (
        <Skeleton variant="rectangular" className="lazy-image__skeleton" />
      );
    }

    return (
      <Image
        className="lazy-image__img"
        src={imageUrl}
        alt={fileName}
        loading="lazy"
        onLoad={handleImageLoaded}
        onResize={handleImageResized}
      />
    );
  };

  return (
    <div ref={ref} data-inview={inView} style={{ width: "100%", height }}>
      {inView ? renderContent() : null}
    </div>
  );
};

export default LazyImage;
