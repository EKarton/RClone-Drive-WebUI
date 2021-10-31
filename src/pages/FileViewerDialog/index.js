import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import useRCloneClient from "hooks/useRCloneClient";
import { useContext, useEffect, useState } from "react";
import { store, actionTypes } from "store/FileViewerStore";
import { ImageMimeTypes } from "utils/constants";

export default function FileViewerDialog() {
  const { state, dispatch } = useContext(store);
  const rCloneClient = useRCloneClient();
  const [fileMimeType, setFileMimeType] = useState();
  const [fileUrl, setFileUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setFileUrl(undefined);

      const response = await rCloneClient.fetchFileContentsV2(
        state.fileInfo.remote,
        state.fileInfo.folderPath,
        state.fileInfo.fileName
      );

      setFileMimeType(response.headers["content-type"]);
      setFileUrl(window.URL.createObjectURL(new Blob([response.data])));
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

    return null;
  };

  return (
    <Dialog
      className="imageviewer-dialog"
      open={state?.isOpen}
      onClose={handleDialogClosed}
      maxWidth="sm"
    >
      {renderDialogContent()}
    </Dialog>
  );
}
