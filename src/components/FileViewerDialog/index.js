import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import FileSaver from 'file-saver';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import TextDialogContent from './TextDialogContent';
import './index.scss';

const MaxWidths = ['xs', 'sm', 'md', 'lg', 'xl'];

export default function FileViewerDialog({ open, fileInfo, onClose }) {
  const rCloneClient = useRCloneClient();

  const [maxWidthIdx, setMaxWidthIdx] = useState(2);
  const [result, setResult] = useState({
    status: StatusTypes.LOADING,
    fileMimeType: undefined,
    fileBlob: undefined,
    fileUrl: undefined,
    error: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setResult({ status: StatusTypes.LOADING });

        const { remote, dirPath, fileName } = fileInfo;
        const response = await rCloneClient.fetchFileContents(remote, dirPath, fileName);

        const mimeType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: mimeType });

        setResult({
          status: StatusTypes.SUCCESS,
          fileMimeType: mimeType,
          fileBlob: blob,
          fileUrl: URL.createObjectURL(blob),
        });
      } catch (error) {
        setResult({ status: StatusTypes.ERROR, error });
      }
    };

    if (open && fileInfo?.remote && fileInfo?.fileName) {
      fetchData();
    }
  }, [fileInfo, open, rCloneClient]);

  const handleDownloadButtonClicked = () => {
    FileSaver.saveAs(result.fileBlob, fileInfo?.fileName);
  };

  const handleZoomInButtonClicked = () => {
    setMaxWidthIdx(Math.min(maxWidthIdx + 1, MaxWidths.length - 1));
  };

  const handleZoomOutButtonClicked = () => {
    setMaxWidthIdx(Math.max(0, maxWidthIdx - 1));
  };

  const handleCloseButtonClicked = () => {
    onClose();
  };

  const renderHeader = () => {
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
          <IconButton onClick={handleCloseButtonClicked}>
            <CloseIcon
              className="fileviewer-dialog__header-content"
              data-testid="close-button"
            />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderDialogContent = () => {
    if (result.status === StatusTypes.LOADING) {
      return (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      );
    }

    if (result.status === StatusTypes.ERROR) {
      return <div data-testid="error-message">Error!</div>;
    }

    if (ImageMimeTypes.has(result.fileMimeType)) {
      return (
        <img
          src={result.fileUrl}
          alt={result.fileInfo?.fileName}
          data-testid="image-content"
        />
      );
    }

    if (result.fileMimeType === 'application/pdf') {
      return <PDFDialogContent fileUrl={result.fileUrl} />;
    }

    return <TextDialogContent fileBlob={result.fileBlob} />;
  };

  return (
    <Dialog
      className="fileviewer-dialog"
      data-testid="fileviewer-dialog"
      open={open}
      onClose={onClose}
      maxWidth={MaxWidths[maxWidthIdx]}
      classes={{ paper: 'fileviewer-dialog__paper', root: 'fileviewer-dialog__root' }}
    >
      {renderHeader()}
      {renderDialogContent()}
    </Dialog>
  );
}

FileViewerDialog.propTypes = {
  open: PropTypes.bool,
  fileInfo: PropTypes.shape({
    remote: PropTypes.string,
    dirPath: PropTypes.string,
    fileName: PropTypes.string,
  }),
  onClose: PropTypes.func,
};
