import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ICON_SIZE } from 'utils/constants';
import BaseRow from '../BaseRow';
import FileIcon from '../FileIcon';
import ContextMenu from './ContextMenu';

export default function StandardRow({
  file,
  iconSize,
  onFileOpen,
  onFileRename,
  onFileCopy,
  onFileDelete,
  onFileDownload,
  onFileMove,
}) {
  const [isRowFocused, setIsRowFocused] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState(null);

  const handleRowFocus = () => {
    setIsRowFocused(true);
  };

  const handleRowBlurred = () => {
    setIsRowFocused(false);
  };

  const handleDoubleClick = () => {
    onFileOpen();
  };

  const handleContextMenuOpened = (e) => {
    e.preventDefault();

    setContextMenuPos({ left: e.clientX - 2, top: e.clientY - 4 });
    setIsContextMenuOpen(true);
  };

  const handleContextMenuClosed = () => {
    setContextMenuPos(undefined);
    setIsContextMenuOpen(false);
  };

  const handleContextMenuClicked = (func) => () => {
    setContextMenuPos(undefined);
    setIsContextMenuOpen(false);
    func();
  };

  return (
    <>
      <BaseRow
        isHighlighted={isRowFocused || isContextMenuOpen}
        fileIcon={<FileIcon file={file} iconSize={iconSize} />}
        fileName={file.name}
        dateModified={file.lastUpdatedTime}
        fileSize={file.isDirectory ? '-' : prettyBytes(file.size)}
        onContextMenu={handleContextMenuOpened}
        onFocus={handleRowFocus}
        onBlur={handleRowBlurred}
        onDoubleClick={handleDoubleClick}
      />
      <ContextMenu
        open={isContextMenuOpen}
        onClose={handleContextMenuClosed}
        menuPosition={contextMenuPos}
        menuButtonEvents={{
          onOpen: handleContextMenuClicked(onFileOpen),
          onDownload: handleContextMenuClicked(onFileDownload),
          onMove: handleContextMenuClicked(onFileMove),
          onCopy: handleContextMenuClicked(onFileCopy),
          onRename: handleContextMenuClicked(onFileRename),
          onDelete: handleContextMenuClicked(onFileDelete),
        }}
      />
    </>
  );
}

StandardRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    lastUpdatedTime: PropTypes.string,
    size: PropTypes.number,
    isDirectory: PropTypes.bool.isRequired,
    isImage: PropTypes.bool.isRequired,
  }),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
};
