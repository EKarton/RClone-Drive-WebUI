import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import FileListTable from 'components/FileListTable';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import { useFileUploader } from 'contexts/FileUploader';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import useFileCopier from 'hooks/utils/useFileCopier';
import useFileDownloader from 'hooks/utils/useFileDownloader';
import useFileRemover from 'hooks/utils/useFileRemover';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import useRenameFileDialog from 'hooks/utils/useRenameFileDialog';
import { ImageMimeTypes, StatusTypes, UploadStatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import AddFilesContextArea from './AddFilesContextArea';
import AddFilesDropSection from './AddFilesDropSection';
import './index.scss';

export default function Table({ remote, path }) {
  const navigate = useNavigate();
  const fileViewer = useFileViewerDialog();
  const moveFileDialog = useMoveFileDialog();
  const renameFileDialog = useRenameFileDialog();
  const downloadFile = useFileDownloader();
  const deleteFile = useFileRemover();
  const copyFile = useFileCopier();
  const { files } = useFileUploader();
  const { status, data, error, refetchData } = useFetchFiles(remote, path);

  useEffect(() => {
    const uploadingFilesUnderRemote = files.filter((file) => {
      const sameRemote = file.remote === remote;
      const isUploading = file.status.value === UploadStatusTypes.UPLOADING;

      return sameRemote && isUploading;
    });

    // Get a file whose dir path is a sub-path of the current path
    const grandSubFiles = uploadingFilesUnderRemote.filter((file) => {
      return file.dirPath !== path && file.dirPath.startsWith(path);
    });

    // Get files who will be directly under this current folder
    const subFiles = uploadingFilesUnderRemote.filter((file) => {
      return file.dirPath === path;
    });

    const subscribers = [];

    if (grandSubFiles.length > 0) {
      const subscriber = grandSubFiles[0].status.subscribe((status) => {
        if (status !== UploadStatusTypes.UPLOADING) {
          refetchData();
        }
      });

      subscribers.push(subscriber);
    }

    subFiles.forEach((file) => {
      const subscriber = file.status.subscribe((status) => {
        if (status !== UploadStatusTypes.UPLOADING) {
          refetchData();
        }
      });

      subscribers.push(subscriber);
    });

    return () => {
      subscribers.forEach((sub) => sub.unsubscribe());
    };
  }, [files, path, refetchData, remote]);

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
      navigate(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: file.folderPath, fileName: file.name });
  };

  return (
    <AddFilesDropSection remote={remote} folderPath={path}>
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
