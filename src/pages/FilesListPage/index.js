import Breadcrumbs from 'components/Breadcrumbs';
import { FileUploaderContextProvider } from 'contexts/FileUploader/index';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog';
import useRemotePathParams from 'hooks/utils/useRemotePathParams';
import { UploadStatusButton } from './Header';
import Table from './Table';
import './index.scss';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FileViewerDialogProvider>
      <MoveFileDialogProvider>
        <RenameFileDialogProvider>
          <FileUploaderContextProvider>
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
          </FileUploaderContextProvider>
        </RenameFileDialogProvider>
      </MoveFileDialogProvider>
    </FileViewerDialogProvider>
  );
}
