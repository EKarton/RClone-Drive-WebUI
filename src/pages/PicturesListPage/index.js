import Breadcrumbs from 'components/Breadcrumbs';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import PicturesListPageErrorBoundary from 'pages/ErrorBoundaries/PicturesListPageErrorBoundary';
import ImageList from './ImageList';
import './index.scss';

export default function PicturesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <PicturesListPageErrorBoundary>
      <FileViewerDialogProvider>
        <Breadcrumbs
          remote={remote}
          path={path}
          homeText="My Pictures"
          homePath="/pictures"
          className="pictures-list-page__header"
        />
        <ImageList remote={remote} path={path} />
      </FileViewerDialogProvider>
    </PicturesListPageErrorBoundary>
  );
}
