import { CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import useRCloneClient from 'hooks/useRCloneClient';
import { useContext, useEffect, useState } from 'react';
import { store, actionTypes } from 'store/FileViewerStore';
import { ImageMimeTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './index.scss';
import { Link } from 'react-router-dom';

export default function FileViewerDialog() {
  const { state, dispatch } = useContext(store);
  const rCloneClient = useRCloneClient();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setFileUrl(undefined);

      const { remote, folderPath, fileName } = state.fileInfo;
      const response = await rCloneClient.fetchImage(remote, folderPath, fileName);

      setFileMimeType(response.headers.get('content-type'));
      setFileUrl(URL.createObjectURL(await response.blob()));
    };

    if (state?.fileInfo) {
      fetchData();
    }
  }, [rCloneClient, state]);

  const handleDialogClosed = () => {
    dispatch({ type: actionTypes.HIDE_DIALOG });
  };

  const renderDownloadButton = () => {
    return (
      <div className="imageviewer-dialog__header">
        <div className="imageviewer-dialog__header-content">
          {state?.fileInfo?.fileName}
        </div>
        <div>
          <Link to={fileUrl} download>
            <IconButton>
              <FileDownloadIcon className="imageviewer-dialog__header-content" />
            </IconButton>
          </Link>
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
}
