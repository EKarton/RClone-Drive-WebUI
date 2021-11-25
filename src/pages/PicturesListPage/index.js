import ImageList from './ImageList';
import Header from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import useFileViewer from 'hooks/useFileViewer';
import { useEffect, useState } from 'react';
import useRCloneClient from 'hooks/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import ImageListSkeleton from './ImageListSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();
  const fileViewer = useFileViewer();

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
      return (
        <div data-testid="imagelistskeleton">
          <ImageListSkeleton />
        </div>
      );
    }

    if (status === StatusTypes.ERROR) {
      return <div>Error!</div>;
    }

    const handleImageClicked = (image) => {
      fileViewer.show(image);
    };

    return (
      <div data-testid="imagelist">
        <ImageList images={data} remote={remote} onImageClicked={handleImageClicked} />
      </div>
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
