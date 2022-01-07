import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { getFullPath } from 'utils/filename-utils';
import TableRow from './TableRow';

export default function Table({ files }) {
  const [pageNum, setPaqeNum] = useState(0);
  const [numRowsPerPage, setNumRowsPerPage] = useState(10);

  const handleChangePage = (_e, newPageNum) => {
    setPaqeNum(newPageNum);
  };

  const handleChangeRowsPerPage = (e) => {
    setNumRowsPerPage(e.target.value);
    setPaqeNum(0);
  };

  const rowsToDisplay = useMemo(() => {
    const startIdx = pageNum * numRowsPerPage;
    const endIdx = (pageNum + 1) * numRowsPerPage;

    return files.slice(startIdx, endIdx);
  }, [files, numRowsPerPage, pageNum]);

  const renderRow = (file) => {
    const fullPathWithRemote = `${file.remote}:${getFullPath(file.dirPath, file.name)}`;

    return <TableRow key={fullPathWithRemote} file={file} />;
  };

  return (
    <>
      <TableContainer sx={{ maxHeight: '60vh' }}>
        <MuiTable
          aria-label="simple table"
          padding="none"
          sx={{ minWidth: 500, tableLayout: 'fixed' }}
        >
          <TableBody>{rowsToDisplay.map((file) => renderRow(file))}</TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={files.length}
        rowsPerPage={numRowsPerPage}
        page={pageNum}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

Table.propTypes = {
  files: PropTypes.arrayOf(TableRow.propTypes.file),
};
