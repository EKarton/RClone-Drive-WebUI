import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import BaseCard from './BaseCard';

export default function InfoCard({ remote, onClick }) {
  const sizeResult = useFetchRemoteSpaceInfo(remote);
  const infoResult = useFetchRemoteInfo(remote);

  const rCloneClient = useRCloneClient();
  const [isClearingTrashCan, setIsClearingTrashCan] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState(undefined);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const renderRemoteInfo = () => {
    if (infoResult.status === StatusTypes.LOADING || isClearingTrashCan) {
      return <Skeleton data-testid="remote-info-skeleton" />;
    }

    if (infoResult.status === StatusTypes.ERROR) {
      return 'Unable to get remote details';
    }

    return `Type: ${infoResult.data?.type}`;
  };

  const renderSpaceUsed = () => {
    if (sizeResult.status === StatusTypes.LOADING || isClearingTrashCan) {
      return <Skeleton data-testid="remote-space-skeleton" />;
    }

    if (sizeResult.status === StatusTypes.ERROR) {
      return 'Unable to get space information';
    }

    const { total, used, trashed } = sizeResult.data;
    const totalSpace = Number.isInteger(total) ? prettyBytes(total) : 'NA';
    const spaceUsed = Number.isInteger(used) ? prettyBytes(used) : 'NA';
    const trashUsed = Number.isInteger(trashed) ? prettyBytes(trashed) : 'NA';

    return `${spaceUsed} / ${totalSpace} used, ${trashUsed} in trash`;
  };

  const handleContextMenu = (e) => {
    e.preventDefault();

    setContextMenuPos({ left: e.clientX - 2, top: e.clientY - 4 });
    setIsContextMenuOpen(true);
  };

  const handleClearTrashClick = async () => {
    try {
      setIsClearingTrashCan(true);
      handleCloseContextMenu();

      await rCloneClient.emptyTrashCan(remote);
    } catch (err) {}

    setIsClearingTrashCan(false);
    sizeResult.refetchData();
    infoResult.refetchData();
  };

  const handleCloseContextMenu = () => {
    setIsContextMenuOpen(false);
    setContextMenuPos(undefined);
  };

  return (
    <>
      <BaseCard
        remoteName={remote}
        remoteType={renderRemoteInfo()}
        remoteSpace={renderSpaceUsed()}
        onClick={onClick}
        onContextMenu={handleContextMenu}
      />
      <Menu
        open={isContextMenuOpen}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={contextMenuPos}
      >
        <MenuItem onClick={handleClearTrashClick} data-testid="clear-trash-button">
          <ListItemIcon>
            <DeleteSweepIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear Trash</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

InfoCard.propTypes = {
  remote: PropTypes.string,
  onClick: PropTypes.func,
};
