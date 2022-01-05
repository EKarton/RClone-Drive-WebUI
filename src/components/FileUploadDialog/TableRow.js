import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { UploadStatusTypes } from 'utils/constants';
import { getFullPath } from 'utils/filename-utils';
import TableRowIcon from './TableRowIcon';

export default function TableRow({ file }) {
  const [status, setStatus] = useState(file.status.value);

  useEffect(() => {
    const subscriber = file.status.subscribe((newStatus) => setStatus(newStatus));

    return () => {
      subscriber.unsubscribe();
    };
  }, [file]);

  const handleButtonClick = () => {
    file.cancelUpload();
  };

  const fullPathWithRemote = `${file.remote}:${getFullPath(file.dirPath, file.name)}`;

  return (
    <MuiTableRow
      key={fullPathWithRemote}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell sx={{ width: '2rem' }}>
        <TableRowIcon fileType={file.type} />
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingRight: '1rem',
        }}
      >
        {file.name}
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingRight: '1rem',
        }}
      >{`${file.remote}:${file.dirPath}`}</TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: '5rem' }}>
        {prettyBytes(file.size)}
      </TableCell>
      <TableCell align="right" sx={{ width: '5rem' }}>
        {status}
      </TableCell>
      <TableCell align="right" sx={{ width: '3rem' }}>
        <IconButton
          aria-label="cancel upload"
          onClick={handleButtonClick}
          disabled={status !== UploadStatusTypes.UPLOADING}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </MuiTableRow>
  );
}
