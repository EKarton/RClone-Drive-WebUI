import { Link } from 'react-router-dom';
import Breadcrumbs from 'components/Breadcrumbs';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import Table from './Table';
import './index.scss';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FileViewerDialogProvider>
      <MoveFileDialogProvider>
        <RenameFileDialogProvider>
          <div className="filelist-page__container">
            <Breadcrumbs
              remote={remote}
              path={path}
              homeLink={<Link to="/files">My Files</Link>}
            />
            <Table remote={remote} path={path} />
          </div>
        </RenameFileDialogProvider>
      </MoveFileDialogProvider>
    </FileViewerDialogProvider>
  );
}
