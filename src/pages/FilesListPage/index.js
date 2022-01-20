import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import FilesListPageErrorBoundary from 'pages/ErrorBoundaries/FilesListPageErrorBoundary';
import Header from './Header';
import TableSection from './TableSection';
import './index.scss';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FilesListPageErrorBoundary>
      <FileViewerDialogProvider>
        <MoveFileDialogProvider>
          <RenameFileDialogProvider>
            <div className="filelist-page__container">
              <Header remote={remote} path={path} />
              <TableSection remote={remote} path={path} />
            </div>
          </RenameFileDialogProvider>
        </MoveFileDialogProvider>
      </FileViewerDialogProvider>
    </FilesListPageErrorBoundary>
  );
}
