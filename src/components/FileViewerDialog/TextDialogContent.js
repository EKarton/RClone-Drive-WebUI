import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import './TextDialogContent.scss';

export default function TextDialogContent({ fileBlob }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fileBlob.text().then((contents) => setData(contents));
  }, [fileBlob]);

  return (
    <DialogContent>
      <DialogContentText className="text-dialog-content">{data}</DialogContentText>
    </DialogContent>
  );
}

TextDialogContent.propTypes = {
  fileBlob: PropTypes.instanceOf(Blob),
};
