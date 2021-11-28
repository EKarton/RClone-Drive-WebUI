import { Dialog, DialogContent, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useRCloneClient from 'hooks/useRCloneClient';
import { useEffect, useState } from 'react';
import { ImageMimeTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './index.scss';
import FileSaver from 'file-saver';
import useFileViewer from 'hooks/useFileViewer';

export default function FileViewerDialog() {
  const { fileInfo, isOpen, hide } = useFileViewer();
  const rCloneClient = useRCloneClient();

  const [error, setError] = useState();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileBlob, setFileBlob] = useState();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFileUrl(undefined);
        setError(undefined);

        const { remote, folderPath, fileName } = fileInfo;
        const response = await rCloneClient.fetchFileContents(
          remote,
          folderPath,
          fileName
        );

        const mimeType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: mimeType });

        setFileMimeType(mimeType);
        setFileBlob(blob);
        setFileUrl(URL.createObjectURL(blob));
      } catch (err) {
        setError(err);
      }
    };

    if (fileInfo?.remote && fileInfo?.folderPath && fileInfo?.fileName) {
      fetchData();
    }
  }, [fileInfo, rCloneClient]);

  const handleDownloadButtonClicked = () => {
    FileSaver.saveAs(fileBlob, fileInfo?.fileName);
  };

  const renderDownloadButton = () => {
    return (
      <div className="imageviewer-dialog__header">
        <div className="imageviewer-dialog__header-content">{fileInfo?.fileName}</div>
        <div>
          <IconButton onClick={handleDownloadButtonClicked}>
            <FileDownloadIcon
              className="imageviewer-dialog__header-content"
              data-testid="download-button"
            />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderDialogContent = () => {
    if (!fileUrl && !error) {
      return (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      );
    }

    if (error) {
      return <div data-testid="error-message">Error!</div>;
    }

    if (ImageMimeTypes.has(fileMimeType)) {
      return <img src={fileUrl} alt={fileInfo?.fileName} data-testid="image-content" />;
    }

    if (fileMimeType === 'application/pdf') {
      return <PDFDialogContent fileUrl={fileUrl} />;
    }

    return null;
  };

  return (
    <Dialog
      className="imageviewer-dialog"
      open={isOpen}
      onClose={hide}
      maxWidth="sm"
      classes={{ paper: 'imageviewer-dialog__paper' }}
    >
      {renderDownloadButton()}
      {renderDialogContent()}
    </Dialog>
  );
}
