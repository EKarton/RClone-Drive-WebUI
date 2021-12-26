import Header from 'components/Breadcrumbs';
import { Link } from 'react-router-dom';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import ImageList from './ImageList';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FileViewerDialogProvider>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/pictures">My Pictures</Link>}
      />
      <ImageList remote={remote} path={path} />
    </FileViewerDialogProvider>
  );
}
