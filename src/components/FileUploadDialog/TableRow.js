import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { UploadStatusTypes } from 'utils/constants';
import './TableRow.scss';
import TableRowIcon from './TableRowIcon';

export default function TableRow({ file }) {
  const [status, setStatus] = useState(file.status.value);

  useEffect(() => {
    const subscriber = file.status.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [file]);

  const handleCancelButtonClick = () => {
    file.cancelUpload();
  };

  const dirPathWithRemote = `${file.remote}:${file.dirPath}`;

  return (
    <MuiTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell className="table-row__file-type-cell">
        <TableRowIcon fileType={file.type} />
      </TableCell>
      <TableCell classes={{ root: 'table-row__file-name-cell' }}>{file.name}</TableCell>
      <TableCell classes={{ root: 'table-row__dir-path-cell' }}>
        {dirPathWithRemote}
      </TableCell>
      <TableCell align="right" className="table-row__file-size-cell">
        {prettyBytes(file.size)}
      </TableCell>
      <TableCell align="right" className="table-row__status-cell">
        {status}
      </TableCell>
      <TableCell align="right" className="table-row__cancel-button-cell">
        <IconButton
          aria-label="cancel upload"
          onClick={handleCancelButtonClick}
          disabled={status !== UploadStatusTypes.UPLOADING}
          data-testid="cancel-upload-button"
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </MuiTableRow>
  );
}
