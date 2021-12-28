import LazyImageList from 'components/LazyImageList';
import LazyImageListSkeleton from 'components/LazyImageListSkeleton';
import useFetchPictures from 'hooks/fetch-data/useFetchPictures';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useRecentlyViewedImages from 'hooks/utils/useRecentlyViewedImages';
import { StatusTypes } from 'utils/constants';

export default function ImageList({ remote, path }) {
  const fileViewer = useFileViewerDialog();
  const recentlyViewedImages = useRecentlyViewedImages();
  const { status, data, error } = useFetchPictures(remote, path);

  if (status === StatusTypes.LOADING) {
    return <LazyImageListSkeleton />;
  }

  if (status === StatusTypes.ERROR) {
    throw error;
  }

  const handleImageClicked = (image) => {
    recentlyViewedImages.addImage(image);
    fileViewer.show(image);
  };

  return (
    <LazyImageList images={data} remote={remote} onImageClicked={handleImageClicked} />
  );
}
