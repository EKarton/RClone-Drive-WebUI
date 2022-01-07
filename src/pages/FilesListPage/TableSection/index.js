import { useNavigate } from 'react-router';
import FileListTable from 'components/FileListTable/index';
import StandardRow from 'components/FileListTableRows/StandardRow';
import UploadingRow from 'components/FileListTableRows/UploadingRow';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import useFileCopier from 'hooks/utils/useFileCopier';
import useFileDownloader from 'hooks/utils/useFileDownloader';
import useFileRemover from 'hooks/utils/useFileRemover';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import useRenameFileDialog from 'hooks/utils/useRenameFileDialog';
import { StatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import AddFilesContextArea from './AddFilesContextArea';
import AddFilesDropSection from './AddFilesDropSection';
import useGetFiles from './hooks/useGetFiles';

export default function TableSection({ remote, path }) {
  const navigate = useNavigate();
  const fileViewer = useFileViewerDialog();
  const moveFileDialog = useMoveFileDialog();
  const renameFileDialog = useRenameFileDialog();
  const downloadFile = useFileDownloader();
  const deleteFile = useFileRemover();
  const copyFile = useFileCopier();
  const { status, error, data, refetchData } = useGetFiles(remote, path);

  if (status === StatusTypes.ERROR) {
    throw error;
  }

  if (status === StatusTypes.LOADING) {
    return <FileListTableSkeleton />;
  }

  const handleFileOpen = (file) => {
    if (file.isDirectory) {
      const newRemotePath = `${remote}:${file.path}`;
      navigate(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: file.folderPath, fileName: file.name });
  };

  return (
    <AddFilesDropSection remote={remote} folderPath={path}>
      <AddFilesContextArea remote={remote} path={path} onNewFolderCreated={refetchData}>
        <FileListTable>
          <>
            {data.existingFiles.map((file) => (
              <StandardRow
                key={file.name}
                file={file}
                onFileOpen={() => handleFileOpen(file)}
                onFileRename={() => renameFileDialog.renameFile(file).then(refetchData)}
                onFileCopy={() => copyFile(file).then(refetchData)}
                onFileDelete={() => deleteFile(file).then(refetchData)}
                onFileDownload={() => downloadFile(file)}
                onFileMove={() => moveFileDialog.moveFile(file).then(refetchData)}
              />
            ))}
          </>
          <>
            {data.uploadingFiles.map((uploadingFile) => (
              <UploadingRow key={uploadingFile.name} file={uploadingFile} />
            ))}
          </>
        </FileListTable>
      </AddFilesContextArea>
    </AddFilesDropSection>
  );
}
