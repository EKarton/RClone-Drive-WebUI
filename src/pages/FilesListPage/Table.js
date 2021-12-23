import FileListTable from 'components/FileListTable';
import { useHistory } from 'react-router';
import './index.scss';
import { hashRemotePath } from 'utils/remote-paths-url';
import useFileViewer from 'hooks/useFileViewer';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import AddFilesDropSection from './AddFilesDropSection';
import AddFilesContextArea from './AddFilesContextArea';
import useFetchFiles from 'hooks/rclone/fetch-data/useFetchFiles';
import useMoveFileDialog from 'hooks/useMoveFileDialog';
import useFileDownloader from 'hooks/useFileDownloader';
import useFileRemover from 'hooks/useFileRemover';
import useFileCopier from 'hooks/useFileCopier';
import useRenameFileDialog from 'hooks/useRenameFileDialog';

export default function Table({ remote, path }) {
  const history = useHistory();
  const fileViewer = useFileViewer();
  const moveFileDialog = useMoveFileDialog();
  const renameFileDialog = useRenameFileDialog();
  const downloadFile = useFileDownloader();
  const deleteFile = useFileRemover();
  const copyFile = useFileCopier();

  const { status, data, refetchData } = useFetchFiles(remote, path);

  if (status === StatusTypes.ERROR) {
    return <div data-testid="error-message">Error!</div>;
  }

  if (status !== StatusTypes.SUCCESS) {
    return <FileListTableSkeleton />;
  }

  const fileList = data.map((file) => ({
    remote,
    folderPath: path,
    path: file.Path,
    name: file.Name,
    lastUpdatedTime: file.ModTime,
    size: file.Size,
    mimeType: file.MimeType,
    isDirectory: file.IsDir,
    isImage: ImageMimeTypes.has(file.MimeType),
  }));

  const handleFileOpen = (file) => {
    if (file.isDirectory) {
      const newRemotePath = `${remote}:${file.path}`;
      history.push(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: file.folderPath, fileName: file.name });
  };

  return (
    <AddFilesDropSection remote={remote} folderPath={path} onUploadedFiles={refetchData}>
      <AddFilesContextArea remote={remote} path={path} onNewFolderCreated={refetchData}>
        <FileListTable
          remote={remote}
          files={fileList}
          onFileOpen={handleFileOpen}
          onFileDownload={(file) => downloadFile(file)}
          onFileDelete={(file) => deleteFile(file).then(refetchData)}
          onFileCopy={(file) => copyFile(file).then(refetchData)}
          onFileRename={(file) => renameFileDialog.renameFile(file).then(refetchData)}
          onFileMove={(file) => moveFileDialog.moveFile(file).then(refetchData)}
        />
      </AddFilesContextArea>
    </AddFilesDropSection>
  );
}
