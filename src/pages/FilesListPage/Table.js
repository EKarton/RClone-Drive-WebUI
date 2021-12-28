import { useHistory } from 'react-router';
import FileListTable from 'components/FileListTable';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import useFileCopier from 'hooks/utils/useFileCopier';
import useFileDownloader from 'hooks/utils/useFileDownloader';
import useFileRemover from 'hooks/utils/useFileRemover';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import useRenameFileDialog from 'hooks/utils/useRenameFileDialog';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import AddFilesContextArea from './AddFilesContextArea';
import AddFilesDropSection from './AddFilesDropSection';
import './index.scss';

export default function Table({ remote, path }) {
  const history = useHistory();
  const fileViewer = useFileViewerDialog();
  const moveFileDialog = useMoveFileDialog();
  const renameFileDialog = useRenameFileDialog();
  const downloadFile = useFileDownloader();
  const deleteFile = useFileRemover();
  const copyFile = useFileCopier();

  const { status, data, error, refetchData } = useFetchFiles(remote, path);

  if (status === StatusTypes.ERROR) {
    throw error;
  }

  if (status === StatusTypes.LOADING) {
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
