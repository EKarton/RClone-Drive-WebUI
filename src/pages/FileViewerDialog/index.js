import { Dialog, DialogContent, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { useEffect, useState } from 'react';
import { ImageMimeTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import './index.scss';
import FileSaver from 'file-saver';
import useFileViewer from 'hooks/useFileViewer';
import { TextDialogContent } from './TextDialogContent';

const MaxWidths = ['xs', 'sm', 'md', 'lg', 'xl'];

export default function FileViewerDialog() {
  const { fileInfo, isOpen, hide } = useFileViewer();
  const rCloneClient = useRCloneClient();

  const [error, setError] = useState();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileBlob, setFileBlob] = useState();
  const [fileUrl, setFileUrl] = useState();

  const [maxWidthIdx, setMaxWidthIdx] = useState(2);

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

    if (fileInfo.remote && fileInfo.fileName) {
      fetchData();
    }
  }, [fileInfo, rCloneClient]);

  const handleDownloadButtonClicked = () => {
    FileSaver.saveAs(fileBlob, fileInfo?.fileName);
  };

  const handleZoomInButtonClicked = () => {
    setMaxWidthIdx(Math.min(maxWidthIdx + 1, MaxWidths.length - 1));
  };

  const handleZoomOutButtonClicked = () => {
    setMaxWidthIdx(Math.max(0, maxWidthIdx - 1));
  };

  const renderDownloadButton = () => {
    return (
      <div className="fileviewer-dialog__header">
        <div className="fileviewer-dialog__header-content">{fileInfo?.fileName}</div>
        <div>
          <IconButton onClick={handleZoomInButtonClicked}>
            <ZoomInIcon
              className="fileviewer-dialog__header-content"
              data-testid="zoom-in-button"
            />
          </IconButton>
          <IconButton onClick={handleZoomOutButtonClicked}>
            <ZoomOutIcon
              className="fileviewer-dialog__header-content"
              data-testid="zoom-out-button"
            />
          </IconButton>
          <IconButton onClick={handleDownloadButtonClicked}>
            <FileDownloadIcon
              className="fileviewer-dialog__header-content"
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

    return <TextDialogContent fileBlob={fileBlob} />;
  };

  return (
    <Dialog
      className="fileviewer-dialog"
      open={isOpen}
      onClose={hide}
      maxWidth={MaxWidths[maxWidthIdx]}
      classes={{ paper: 'fileviewer-dialog__paper', root: 'fileviewer-dialog__root' }}
    >
      {renderDownloadButton()}
      {renderDialogContent()}
    </Dialog>
  );
}
