import FileListTable from 'components/FileListTable';
import { useHistory } from 'react-router';
import './index.scss';
import { hashRemotePath } from 'utils/remote-paths-url';
import useFileViewer from 'hooks/useFileViewer';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';
import AddFilesDropSection from './AddFilesDropSection';
import Header from './Header';
import AddFilesContextArea from './AddFilesContextArea';
import { useFetchFiles } from 'hooks/rclone/fetch-data/useFetchFiles';
import { useRenameFileModal } from './useRenameFileModal';
import { useMoveFileDialog } from './useMoveFileDialog';
import { useFileDownloader } from './useFileDownloader';
import { useFileRemover } from './useFileRemover';
import { useFileCopier } from './useFileCopier';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();
  const history = useHistory();
  const fileViewer = useFileViewer();
  const downloadFile = useFileDownloader();
  const deleteFile = useFileRemover();
  const copyFile = useFileCopier();

  const { status, data, refetchData } = useFetchFiles(remote, path);

  const { modal: renameFileModal, requestToRenameFile } = useRenameFileModal();
  const { modal: moveFileModal, requestToMoveFile } = useMoveFileDialog();

  const renderTable = () => {
    if (status === StatusTypes.ERROR) {
      return <div data-testid="error-message">Error!</div>;
    }

    if (status !== StatusTypes.SUCCESS) {
      return <FileListTableSkeleton />;
    }

    const fileList = data.map((file) => ({
      remote,
      path,
      name: file.Name,
      lastUpdatedTime: file.ModTime,
      size: file.Size,
      mimeType: file.MimeType,
      isDirectory: file.IsDir,
      isImage: ImageMimeTypes.has(file.MimeType),
    }));

    const existingFolderNames = data.filter((f) => f.IsDir).map((dir) => dir.Name);

    const handleFileOpen = (file) => {
      if (file.isDirectory) {
        const newRemotePath = `${remote}:${file.path}`;
        history.push(`/files/${hashRemotePath(newRemotePath)}`);
        return;
      }

      fileViewer.show({ remote, folderPath: path, fileName: file.name });
    };

    return (
      <AddFilesDropSection
        remote={remote}
        folderPath={path}
        onUploadedFiles={refetchData}
      >
        <AddFilesContextArea
          remote={remote}
          path={path}
          existingFolderNames={existingFolderNames}
          onNewFolderCreated={refetchData}
        >
          <FileListTable
            remote={remote}
            files={fileList}
            onFileOpen={handleFileOpen}
            onFileDownload={(file) => downloadFile(file)}
            onFileDelete={(file) => deleteFile(file).then(refetchData)}
            onFileCopy={(file) => copyFile(file).then(refetchData)}
            onFileRename={(file) => requestToRenameFile(file)}
            onFileMove={(file) => requestToMoveFile(file)}
          />
        </AddFilesContextArea>
      </AddFilesDropSection>
    );
  };

  return (
    <div className="filelist-page__container">
      <Header remote={remote} path={path} />
      {renderTable()}
      {renameFileModal}
      {moveFileModal}
    </div>
  );
}
