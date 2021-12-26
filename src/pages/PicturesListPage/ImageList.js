import LazyImageList from 'components/LazyImageList';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import { StatusTypes } from 'utils/constants';
import LazyImageListSkeleton from 'components/LazyImageListSkeleton';
import useRecentlyViewedImages from 'hooks/utils/useRecentlyViewedImages';
import useFetchPictures from 'hooks/fetch-data/useFetchPictures';

export default function ImageList({ remote, path }) {
  const fileViewer = useFileViewerDialog();
  const recentlyViewedImages = useRecentlyViewedImages();
  const { status, data } = useFetchPictures(remote, path);

  if (status === StatusTypes.LOADING) {
    return <LazyImageListSkeleton />;
  }

  if (status === StatusTypes.ERROR) {
    return <div>Error!</div>;
  }

  const handleImageClicked = (image) => {
    recentlyViewedImages.addImage(image);
    fileViewer.show(image);
  };

  return (
    <LazyImageList images={data} remote={remote} onImageClicked={handleImageClicked} />
  );
}
