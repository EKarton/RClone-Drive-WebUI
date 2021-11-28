import { Card, CardActionArea } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import Image from 'components/Image';
import useFileViewer from 'hooks/useFileViewer';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import './RecentPicturesSection.scss';

export default function RecentPicturesSection() {
  const { recentPictures, addImage } = useRecentlyViewedImages();
  const fileViewer = useFileViewer();

  if (recentPictures.length === 0) {
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
            const imagesToShow = recentPictures.slice(0, numImagesToShow);

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
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
}
