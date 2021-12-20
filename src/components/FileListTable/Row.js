import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import './Row.scss';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import cx from 'classnames';
import ContextMenu from './ContextMenu';
import FileIcon from './FileIcon';

export default function Row({
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

  const isRowHighlighted = isRowFocused || isContextMenuOpen;

  return (
    <>
      <Table.Row
        className={cx('filelist-table-row', {
          'filelist-table-row--highlight': isRowHighlighted,
        })}
        onContextMenu={handleContextMenuOpened}
        onFocus={handleRowFocus}
        onBlur={handleRowBlurred}
        onDoubleClick={handleDoubleClick}
        tabIndex="0"
      >
        <Table.Cell className="filelist-table-row__table-cell">
          <div className="filelist-table-row__file-cell" data-testid={file.name}>
            <FileIcon file={file} iconSize={iconSize} />
            <div>{file.name}</div>
          </div>
        </Table.Cell>
        <Table.Cell className="filelist-table-row__table-cell">
          {file.lastUpdatedTime}
        </Table.Cell>
        <Table.Cell className="filelist-table-row__table-cell">
          {file.isDirectory ? '-' : prettyBytes(file.size)}
        </Table.Cell>
      </Table.Row>
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

Row.propType = {
  file: PropTypes.shape({
    name: PropTypes.string,
    lastUpdatedTime: PropTypes.string,
    size: PropTypes.string,
    isDirectory: PropTypes.bool.isRequired,
    isImage: PropTypes.bool.isRequired,
    preview: PropTypes.node,
  }),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
};
