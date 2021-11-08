import { CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import useRCloneClient from 'hooks/useRCloneClient';
import { useContext, useEffect, useState } from 'react';
import { store, actionTypes } from 'contexts/FileViewerStore';
import { ImageMimeTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './index.scss';
import FileSaver from 'file-saver';

const FileViewerDialog = () => {
  const { state, dispatch } = useContext(store);
  const rCloneClient = useRCloneClient();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileBlob, setFileBlob] = useState();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setFileUrl(undefined);

      const { remote, folderPath, fileName } = state.fileInfo;
      const response = await rCloneClient.fetchFileContents(remote, folderPath, fileName);

      const mimeType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: mimeType });

      setFileMimeType(mimeType);
      setFileBlob(blob);
      setFileUrl(URL.createObjectURL(blob));
    };

    if (state?.fileInfo) {
      fetchData();
    }
  }, [rCloneClient, state]);

  const handleDialogClosed = () => {
    dispatch({ type: actionTypes.HIDE_DIALOG });
  };

  const handleDownloadButtonClicked = () => {
    FileSaver.saveAs(fileBlob, state?.fileInfo?.fileName);
  };

  const renderDownloadButton = () => {
    return (
      <div className="imageviewer-dialog__header">
        <div className="imageviewer-dialog__header-content">
          {state?.fileInfo?.fileName}
        </div>
        <div>
          <IconButton onClick={handleDownloadButtonClicked}>
            <FileDownloadIcon className="imageviewer-dialog__header-content" />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderDialogContent = () => {
    if (!fileUrl) {
      return (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      );
    }

    if (ImageMimeTypes.has(fileMimeType)) {
      return <img src={fileUrl} alt={state?.fileInfo?.fileName} />;
    }

    if (fileMimeType === 'application/pdf') {
      return <PDFDialogContent fileUrl={fileUrl} />;
    }

    return null;
  };

  return (
    <Dialog
      className="imageviewer-dialog"
      open={state?.isOpen}
      onClose={handleDialogClosed}
      maxWidth="sm"
      classes={{ paper: 'imageviewer-dialog__paper' }}
    >
      {renderDownloadButton()}
      {renderDialogContent()}
    </Dialog>
  );
};

export default FileViewerDialog;
