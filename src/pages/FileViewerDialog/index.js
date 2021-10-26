import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import useRCloneClient from "hooks/useRCloneClient";
import { useContext, useEffect, useState } from "react";
import { store, actionTypes } from "store/FileViewerStore";

export default function ImageViewerDialog() {
  const { state, dispatch } = useContext(store);
  const rCloneClient = useRCloneClient();
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setImageUrl(undefined);

      const imageContents = await rCloneClient.fetchFileContents(
        state.fileInfo.remote,
        state.fileInfo.path,
        state.fileInfo.name
      );

      setImageUrl(window.URL.createObjectURL(new Blob([imageContents])));
    };

    if (state && state.fileInfo) {
      fetchData();
    }
  }, [rCloneClient, state]);

  const handleClose = () => {
    dispatch({ type: actionTypes.HIDE_DIALOG });
  };

  const renderMainContent = () => {
    if (!imageUrl) {
      return (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      );
    }

    if (state?.fileInfo?.mimeType === "image/jpeg") {
      return <img src={imageUrl} alt={state?.fileInfo?.name} />;
    }

    return null;
  };

  return (
    <Dialog
      className="imageviewer-dialog"
      open={state?.isOpen}
      onClose={handleClose}
    >
      {renderMainContent()}
    </Dialog>
  );
}
