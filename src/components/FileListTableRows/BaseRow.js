import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './BaseRow.scss';

export default function BaseRow({
  isHighlighted,
  fileIcon,
  fileName,
  dateModified,
  fileSize,
  ...props
}) {
  return (
    <TableRow
      className={cx('filelist-table-base-row', {
        'filelist-table-base-row--highlight': isHighlighted,
      })}
      tabIndex="0"
      {...props}
    >
      <TableCell className="filelist-table-base-row__table-cell">
        <div className="filelist-table-base-row__file-cell" data-testid={fileName}>
          {fileIcon}
          <div>{fileName}</div>
        </div>
      </TableCell>
      <TableCell className="filelist-table-base-row__table-cell">
        {dateModified}
      </TableCell>
      <TableCell className="filelist-table-base-row__table-cell">{fileSize}</TableCell>
    </TableRow>
  );
}

BaseRow.propTypes = {
  isHighlighted: PropTypes.bool,
  fileIcon: PropTypes.node,
  fileName: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  dateModified: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  fileSize: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
