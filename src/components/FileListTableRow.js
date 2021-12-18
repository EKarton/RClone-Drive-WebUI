import PropTypes from 'prop-types';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import Icon from '@mui/material/Icon';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import './FileListTableRow.scss';
import prettyBytes from 'pretty-bytes';
import ContextMenu from './ContextMenu';
import { useState } from 'react';
import cx from 'classnames';

export default function FileListTableRow(props) {
  const { file, iconSize } = props;
  const { onFileClicked, onFileRename, onFileCopy, onFileDelete } = props;
  const { onFileDownload, onFileMove } = props;
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const handleContextMenuChanged = ({ isOpen }) => {
    setIsContextMenuOpen(isOpen);
  };

  const renderFileIcon = (file) => {
    if (file.isDirectory) {
      return <FolderIcon fontSize={iconSize} />;
    }

    if (file.isImage && file.preview) {
      return (
        <Icon fontSize={iconSize} className="filelist-table-row-row__preview-icon">
          {file.preview}
        </Icon>
      );
    }

    if (file.isImage) {
      return <ImageIcon fontSize={iconSize} />;
    }

    return <DescriptionIcon fontSize={iconSize} />;
  };

  return (
    <ContextMenu
      onOpen={() => onFileClicked(file)}
      onDownload={() => onFileDownload(file)}
      onDelete={() => onFileDelete(file)}
      onMove={() => onFileMove(file)}
      onCopy={() => onFileCopy(file)}
      onRename={() => onFileRename(file)}
      onMenuChanged={handleContextMenuChanged}
    >
      <Table.Row
        key={file.name}
        className={cx('filelist-table-row__row', {
          'filelist-table-row__row--highlight': isContextMenuOpen,
        })}
      >
        <Table.Cell className="filelist-table-row__table-cell">
          <div
            className="filelist-table-row__file-cell"
            onClick={() => onFileClicked(file)}
            data-testid={file.name}
          >
            {renderFileIcon(file)}
            <div>{file.name}</div>
          </div>
        </Table.Cell>
        <Table.Cell className="filelist-table-row__table-cell">
          {file.lastUpdatedTime}
        </Table.Cell>
        <Table.Cell className="filelist-table-row__table-cell">
          {file.isDirectory ? '-' : prettyBytes(file.size)}
        </Table.Cell>
        {isContextMenuOpen && <div className="filelist-table-row__overlay"></div>}
      </Table.Row>
    </ContextMenu>
  );
}

FileListTableRow.propType = {
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
