import ImageList from './ImageList';
import Header from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import useFileViewer from 'hooks/useFileViewer';
import { useCallback } from 'react';
import { StatusTypes } from 'utils/constants';
import ImageListSkeleton from './ImageListSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import useFetchRCloneData from 'hooks/useFetchRCloneData';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();
  const fileViewer = useFileViewer();
  const recentlyViewedImages = useRecentlyViewedImages();

  const fetchPictures = useCallback((c) => c.fetchPictures(remote, path), [remote, path]);
  const { status, data } = useFetchRCloneData(fetchPictures);

  const renderImageList = () => {
    if (status === StatusTypes.LOADING) {
      return <ImageListSkeleton data-testid="imagelistskeleton" />;
    }

    if (status === StatusTypes.ERROR) {
      return <div>Error!</div>;
    }

    const handleImageClicked = (image) => {
      recentlyViewedImages.addImage(image);
      fileViewer.show(image);
    };

    return (
      <ImageList
        images={data}
        remote={remote}
        onImageClicked={handleImageClicked}
        data-testid="imagelist"
      />
    );
  };

  return (
    <>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/pictures">My Pictures</Link>}
      />
      {renderImageList()}
    </>
  );
}
