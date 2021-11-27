import AutoSizer from 'react-virtualized-auto-sizer';
import Image from 'components/Image';
import useFileViewer from 'hooks/useFileViewer';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import './RecentlyViewedImages.scss';

export default function RecentlyViewedImages() {
  const { recentPictures } = useRecentlyViewedImages();
  const fileViewer = useFileViewer();

  if (recentPictures.length === 0) {
    return null;
  }

  const handleImageClicked = (image) => () => {
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
                  <div
                    key={image.fileName}
                    className="recently-viewed-image__img-wrapper"
                    onClick={handleImageClicked(image)}
                    data-testid={image.fileName}
                  >
                    <Image
                      image={image}
                      imgClassName="recently-viewed-image__img-image"
                      skeletonClassName="recently-viewed-image__img-skeleton"
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
}
