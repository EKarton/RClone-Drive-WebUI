import { Card, CardActionArea } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import Image from 'components/Image';
import useFileViewer from 'hooks/useFileViewer';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import './RecentPicturesSection.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export default function RecentPicturesSection() {
  const { recentPictures, addImage } = useRecentlyViewedImages();
  const rCloneClient = useRCloneClient();
  const fileViewer = useFileViewer();

  const [existingPictures, setExistingPictures] = useState([]);

  useEffect(() => {
    const cancelSource = axios.CancelToken.source();

    const getExistingPictures = async () => {
      const existingPictures = [];

      let i = 0;
      while (i < recentPictures.length && existingPictures.length < 6) {
        const picturesToCheck = [];

        for (let j = i; j < Math.min(i + 6, recentPictures.length); j++) {
          picturesToCheck.push(recentPictures[i + j]);
        }

        const doPicturesExist = await Promise.all(
          picturesToCheck.map(async (picture) => {
            const { remote, folderPath, fileName } = picture;
            const path = folderPath ? `${folderPath}/${fileName}` : fileName;

            try {
              const opts = { cancelToken: cancelSource.token };
              const details = await rCloneClient.fetchFileInfo(remote, path, opts);

              return details !== null;
            } catch (err) {
              return false;
            }
          })
        );

        for (let j = 0; j < picturesToCheck.length; j++) {
          if (doPicturesExist[j]) {
            existingPictures.push(picturesToCheck[j]);
          }
        }

        i += 6;
      }

      setExistingPictures(existingPictures);
    };

    getExistingPictures();

    return () => {
      cancelSource.cancel();
    };
  }, [rCloneClient, recentPictures]);

  if (existingPictures.length === 0) {
    return null;
  }

  const handleImageClicked = (image) => () => {
    addImage(image);
    fileViewer.show(image);
  };

  return (
    <>
      <h4>Recently Viewed Pictures</h4>
      <div className="recently-viewed-image">
        <AutoSizer>
          {({ height, width }) => {
            const numImagesToShow = width < 1920 ? 4 : 6;
            const imagesToShow = existingPictures.slice(0, numImagesToShow);

            const numFillers = Math.max(0, numImagesToShow - imagesToShow.length);

            return (
              <div style={{ width, height }} className="recently-viewed-image__wrapper">
                {imagesToShow.map((image) => (
                  <Card className="recently-viewed-image__card" key={image.fileName}>
                    <CardActionArea
                      className="recently-viewed-image__card-area"
                      onClick={handleImageClicked(image)}
                      data-testid={image.fileName}
                    >
                      <Image
                        image={image}
                        imgClassName="recently-viewed-image__img-image"
                        skeletonClassName="recently-viewed-image__img-skeleton"
                      />
                    </CardActionArea>
                  </Card>
                ))}
                {Array.from({ length: numFillers }, (_, i) => (
                  <div
                    key={i}
                    className="recently-viewed-image__card"
                    data-testid="image-fillers"
                  />
                ))}
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
}
