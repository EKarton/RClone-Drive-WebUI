import { Skeleton } from "@mui/material";
import useRCloneClient from "hooks/useRCloneClient";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./LazyImage.scss";

const LazyImage = ({ image, width, height }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "0px",
  });

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

    if (inView && !imageUrl && image) {
      fetchData();
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image, imageUrl, inView, rCloneClient]);

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
      <img
        className="lazy-image__img"
        src={imageUrl}
        alt={image.fileName}
        loading="lazy"
        width={width}
        height={height}
      />
    );
  };

  return (
    <div ref={ref} data-inview={inView} style={{ width, height }}>
      {inView ? renderContent() : null}
    </div>
  );
};

export default LazyImage;
