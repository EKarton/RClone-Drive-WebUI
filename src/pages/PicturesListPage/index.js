import ImageList from './ImageList';
import { useParams } from 'react-router';
import { unhashRemotePath } from 'utils/remote-paths-url';
import Header from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import useFileViewer from 'hooks/useFileViewer';
import { useEffect, useState } from 'react';
import useRCloneClient from 'hooks/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import ImageListSkeleton from './ImageListSkeleton';

export default function PicturesListPage() {
  const { id } = useParams();
  const fileViewer = useFileViewer();

  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(':');

  const rCloneClient = useRCloneClient();
  const [status, setStatus] = useState();
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
      return <ImageListSkeleton />;
    }

    if (status === StatusTypes.ERROR) {
      return <div>Error! {error}</div>;
    }

    const handleImageClicked = (image) => {
      fileViewer.show(image);
    };

    return (
      <ImageList images={data} remote={remote} onImageClicked={handleImageClicked} />
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
