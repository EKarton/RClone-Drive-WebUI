import FolderTree from "./FolderTree";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";

const FolderBrowserDialog = ({ remote, open, onClose }) => {
  const [selectedFolder, setSelectedFolder] = useState("");

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(selectedFolder);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>
        <div>Select which folder to view pictures from</div>
        <strong>{remote}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <FolderTree remote={remote} onFolderSelect={setSelectedFolder} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderBrowserDialog;
