import { createContext, useState } from 'react';
import FileViewerDialog from 'components/FileViewerDialog';

export const FileViewerDialogContext = createContext();

export function FileViewerDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState();

  const handleClose = () => {
    setFileInfo(undefined);
    setIsOpen(false);
  };

  const show = (file) => {
    setFileInfo(file);
    setIsOpen(true);
  };

  return (
    <FileViewerDialogContext.Provider value={{ show }}>
      <FileViewerDialog open={isOpen} fileInfo={fileInfo} onClose={handleClose} />
      {children}
    </FileViewerDialogContext.Provider>
  );
}
