import Breadcrumbs from 'components/Breadcrumbs';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import FilesListPageErrorBoundary from 'pages/ErrorBoundaries/FilesListPageErrorBoundary';
import Table from './Table';
import UploadStatusButton from './UploadStatusButton';
import './index.scss';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FilesListPageErrorBoundary>
      <FileViewerDialogProvider>
        <MoveFileDialogProvider>
          <RenameFileDialogProvider>
            <div className="filelist-page__container">
              <div className="filelist-page__header">
                <Breadcrumbs
                  remote={remote}
                  path={path}
                  homeText="My Files"
                  homePath="/files"
                />
                <UploadStatusButton />
              </div>
              <Table remote={remote} path={path} />
            </div>
          </RenameFileDialogProvider>
        </MoveFileDialogProvider>
      </FileViewerDialogProvider>
    </FilesListPageErrorBoundary>
  );
}
