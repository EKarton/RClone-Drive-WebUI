import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import useRCloneClient from 'hooks/useRCloneClient';
import { useContext, useEffect, useState } from 'react';
import { store, actionTypes } from 'store/FileViewerStore';
import { ImageMimeTypes } from 'utils/constants';
import PDFDialogContent from './PDFDialogContent';
import './index.scss';

export default function FileViewerDialog() {
  const { state, dispatch } = useContext(store);
  const rCloneClient = useRCloneClient();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setFileUrl(undefined);

      const { remote, folderPath, fileName } = state.fileInfo;
      const response = await rCloneClient.fetchFileContentsV2(
        remote,
        folderPath,
        fileName
      );

      setFileMimeType(response.headers['content-type']);
      setFileUrl(URL.createObjectURL(new Blob([response.data])));
    };

    if (state?.fileInfo) {
      fetchData();
    }
  }, [rCloneClient, state]);

  const handleDialogClosed = () => {
    dispatch({ type: actionTypes.HIDE_DIALOG });
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
      {renderDialogContent()}
    </Dialog>
  );
}
