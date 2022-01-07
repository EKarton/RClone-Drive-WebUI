import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

export default function ContextMenu({
  open,
  onClose,
  menuPosition,
  menuButtonEvents: { onOpen, onDownload, onMove, onCopy, onRename, onDelete },
}) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition}
      data-testid="filetable-context-menu"
    >
      <MenuItem onClick={onOpen} data-testid="open">
        <ListItemIcon>
          <FileOpenIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Open</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDownload} data-testid="download">
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Download</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onMove} data-testid="move">
        <ListItemIcon>
          <DriveFileMoveIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Move to</ListItemText>
      </MenuItem>
      <MenuItem onClick={onCopy} data-testid="copy">
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
      </MenuItem>
      <MenuItem onClick={onRename} data-testid="rename">
        <ListItemIcon>
          <DriveFileRenameOutlineIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onDelete} data-testid="delete">
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}

ContextMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  menuPosition: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }),
  menuButtonEvents: PropTypes.shape({
    onOpen: PropTypes.func,
    onDownload: PropTypes.func,
    onMove: PropTypes.func,
    onCopy: PropTypes.func,
    onRename: PropTypes.func,
    onDelete: PropTypes.func,
  }),
};
