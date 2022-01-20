import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useState } from 'react';
import FolderTree from 'components/FolderTree';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';

export default function MoveFileDialog({ open, fileName, onCancel, onOk }) {
  const [remotePath, setRemotePath] = useState('');
  const { status, data } = useFetchRemotes();

  const handleOk = () => {
    if (remotePath === '') {
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

    const handleSelectedItem = (remotePath) => {
      setRemotePath(remotePath);
    };

    return <FolderTree remotes={data} onSelect={handleSelectedItem} />;
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={onCancel}
      data-testid="move-file-dialog"
    >
      <DialogTitle>
        Move <strong>{fileName}</strong> to:
      </DialogTitle>
      <DialogContent dividers>{renderFolderTree()}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} data-testid="cancel-button">
          Cancel
        </Button>
        <Button onClick={handleOk} data-testid="ok-button">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MoveFileDialog.propTypes = {
  open: PropTypes.bool,
  fileName: PropTypes.string,
  onCancel: PropTypes.bool,
  onOk: PropTypes.bool,
};
