import ImageList from './ImageList';
import Header from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import useFileViewer from 'hooks/useFileViewer';
import { useEffect, useState } from 'react';
import useRCloneClient from 'hooks/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import ImageListSkeleton from './ImageListSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();
  const fileViewer = useFileViewer();
  const recentlyViewedImages = useRecentlyViewedImages();

  const rCloneClient = useRCloneClient();
  const [status, setStatus] = useState(StatusTypes.LOADING);
  const [error, setError] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus(StatusTypes.LOADING);
        setError(null);

        const data = await rCloneClient.fetchPictures(remote, path);

        setStatus(StatusTypes.SUCCESS);
        setData(data);
      } catch (err) {
        setStatus(StatusTypes.ERROR);
        setError(err);
      }
    };

    fetchData();
  }, [rCloneClient, remote, path]);

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
