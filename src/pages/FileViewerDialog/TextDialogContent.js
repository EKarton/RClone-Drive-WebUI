import { DialogContent, DialogContentText } from '@mui/material';
import { useState, useEffect } from 'react';
import './TextDialogContent.scss';

export function TextDialogContent({ fileBlob }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fileBlob.text().then((contents) => setData(contents));
  });

  return (
    <DialogContent>
      <DialogContentText className="text-dialog-content">{data}</DialogContentText>
    </DialogContent>
  );
}
