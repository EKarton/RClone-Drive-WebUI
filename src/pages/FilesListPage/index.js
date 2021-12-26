import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import Header from './Header';
import Table from './Table';
import './index.scss';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <MoveFileDialogProvider>
      <RenameFileDialogProvider>
        <div className="filelist-page__container">
          <Header remote={remote} path={path} />
          <Table remote={remote} path={path} />
        </div>
      </RenameFileDialogProvider>
    </MoveFileDialogProvider>
  );
}
