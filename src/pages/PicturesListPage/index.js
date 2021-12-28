import { Link } from 'react-router-dom';
import Header from 'components/Breadcrumbs';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import ImageList from './ImageList';
import './index.scss';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FileViewerDialogProvider>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/pictures">My Pictures</Link>}
        className="pictures-list-page__header"
      />
      <ImageList remote={remote} path={path} />
    </FileViewerDialogProvider>
  );
}
