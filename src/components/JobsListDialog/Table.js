import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTablePagination from '@mui/material/TablePagination';
import { useMemo, useState } from 'react';
import TableRow from './TableRow';

export default function Table({ jobs }) {
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

    return jobs.slice(startIdx, endIdx);
  }, [jobs, numRowsPerPage, pageNum]);

  return (
    <>
      <MuiTableContainer sx={{ maxHeight: '60vh' }}>
        <MuiTable
          aria-label="simple table"
          padding="none"
          sx={{ minWidth: 500, tableLayout: 'fixed' }}
        >
          <MuiTableBody>
            {rowsToDisplay.map((job) => (
              <TableRow key={job.jobId} job={job} data-testid={`job-id-${job.jobId}`} />
            ))}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
      <MuiTablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={jobs.length}
        rowsPerPage={numRowsPerPage}
        page={pageNum}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
