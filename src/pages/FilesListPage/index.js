import FileListTable from 'components/FileListTable';
import { useState } from 'react';
import { useHistory } from 'react-router';
import './index.scss';
import { hashRemotePath } from 'utils/remote-paths-url';
import useFileViewer from 'hooks/useFileViewer';
import LazyImage from 'components/LazyImage';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';
import AddFilesDropSection from './AddFilesDropSection';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import FileSaver from 'file-saver';
import { getNewFilename } from 'utils/filename-utils';
import RenameFileDialog from './RenameFileDialog';
import MoveFileDialog from './MoveFileDialog';
import Header from './Header';
import AddFilesContextArea from './AddFilesContextArea';
import { useFetchFiles } from 'hooks/rclone/fetch-data/useFetchFiles';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();
  const history = useHistory();
  const fileViewer = useFileViewer();
  const rCloneClient = useRCloneClient();
  const { status, data, refetchData } = useFetchFiles(remote, path);

  const [isRenameFileModalOpen, setIsRenameFileModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});

  const [isMoveFileModalOpen, setIsMoveFileModalOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState({});

  const handleFileOpen = (file) => {
    if (file.isDirectory) {
      const newRemotePath = `${remote}:${file.path}`;
      history.push(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: path, fileName: file.name });
  };

  const handleFileDownload = async (file) => {
    const fileName = file.name;
    const response = await rCloneClient.fetchFileContents(remote, path, fileName);

    const mimeType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: mimeType });

    FileSaver.saveAs(blob, fileName);
  };

  const handleFileDelete = async (file) => {
    if (file.isDirectory) {
      await rCloneClient.deleteDirectory(remote, path, file.name);
    } else {
      await rCloneClient.deleteFile(remote, path, file.name);
    }

    refetchData();
  };

  const handleFileCopy = async (file) => {
    const fileName = file.name;
    const existingFileNames = data.map((file) => file.Name);
    const newFileName = getNewFilename(fileName, existingFileNames);

    const src = { remote, folderPath: path, fileName };
    const target = { remote, folderPath: path, fileName: newFileName };

    await rCloneClient.copyFile(src, target);
    refetchData();
  };

  const handleRequestFileRename = (file) => {
    setIsRenameFileModalOpen(true);
    setFileToRename(file);
  };

  const handleFileModalCancelled = () => {
    setIsRenameFileModalOpen(false);
    setFileToRename(null);
  };

  const handleFileModalRename = async (newFileName) => {
    const src = { remote, folderPath: path, fileName: fileToRename.name };
    const target = { remote, folderPath: path, fileName: newFileName };

    if (fileToRename.isDirectory) {
      await rCloneClient.move(src, target, true);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setIsRenameFileModalOpen(false);
    setFileToRename(null);
    refetchData();
  };

  const handleRequestFileMove = (file) => {
    setIsMoveFileModalOpen(true);
    setFileToMove(file);
  };

  const handleMoveFileDialogCancelled = () => {
    setIsMoveFileModalOpen(false);
    setFileToMove(undefined);
  };

  const handleMoveFileDialogOk = async (remotePath) => {
    const [newRemote, newPath] = remotePath.split(':');
    const src = { remote, folderPath: path, fileName: fileToMove.name };
    const target = { remote: newRemote, folderPath: newPath, fileName: fileToMove.name };

    if (fileToMove.isDirectory) {
      await rCloneClient.move(src, target, true, false);
      await rCloneClient.deleteDirectory(remote, path, fileToMove.name);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setIsMoveFileModalOpen(false);
    setFileToMove(undefined);
    refetchData();
  };

  const renderTable = () => {
    if (status === StatusTypes.ERROR) {
      return <div data-testid="error-message">Error!</div>;
    }

    if (status !== StatusTypes.SUCCESS) {
      return <FileListTableSkeleton />;
    }

    const fileList = data.map((file) => ({
      name: file.Name,
      lastUpdatedTime: file.ModTime,
      path: file.Path,
      size: file.Size,
      mimeType: file.MimeType,
      isDirectory: file.IsDir,
      isImage: ImageMimeTypes.has(file.MimeType),
      preview: (
        <LazyImage
          image={{
            remote,
            folderPath: path,
            fileName: file.Name,
          }}
          imgClassName="filelist-page__img"
        />
      ),
    }));

    const existingFolderNames = fileList
      .filter((f) => f.isDirectory)
      .map((dir) => dir.name);

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
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onFileCopy={handleFileCopy}
            onFileRename={handleRequestFileRename}
            onFileMove={handleRequestFileMove}
          />
        </AddFilesContextArea>
      </AddFilesDropSection>
    );
  };

  return (
    <div className="filelist-page__container">
      <Header remote={remote} path={path} />
      {renderTable()}
      <RenameFileDialog
        open={isRenameFileModalOpen}
        fileName={fileToRename?.name}
        onCancel={handleFileModalCancelled}
        onRename={handleFileModalRename}
      />
      <MoveFileDialog
        open={isMoveFileModalOpen}
        onCancel={handleMoveFileDialogCancelled}
        onOk={handleMoveFileDialogOk}
      />
    </div>
  );
}
