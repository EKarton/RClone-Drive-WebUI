import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useCallback, useState } from 'react';
import useFetchRCloneData from 'hooks/useFetchRCloneData';
import { StatusTypes } from 'utils/constants';
import FolderTree from 'pages/PicturesPage/FolderTree';

export default function MoveFileDialog({ open, onCancel, onOk }) {
  const [remotePath, setRemotePath] = useState('');

  const fetchRemotes = useCallback((c) => c.fetchRemotes(), []);
  const { status, data } = useFetchRCloneData(fetchRemotes);

  const handleSelectedItem = (remotePath) => {
    setRemotePath(remotePath);
  };

  const handleOk = () => {
    if (!remotePath) {
      onCancel();
    }

    onOk(remotePath);
  };

  const renderFolderTree = () => {
    if (status === StatusTypes.ERROR) {
      return <div>Error</div>;
    }

    if (status === StatusTypes.LOADING) {
      return <div>Loading...</div>;
    }

    return <FolderTree remotes={data} onSelect={handleSelectedItem} />;
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>Move File / Directory</DialogTitle>
      <DialogContent dividers>{renderFolderTree()}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk} data-testid="ok-button">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
