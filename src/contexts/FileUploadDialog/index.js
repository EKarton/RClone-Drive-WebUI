import { createContext, useContext, useState } from 'react';
import FileUploadDialog from 'components/FileUploadDialog';

const FileUploadDialogContext = createContext();

export const FileUploadDialogProvider = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <FileUploadDialogContext.Provider value={{ openDialog }}>
      <FileUploadDialog open={isDialogOpen} onClose={closeDialog} />
      {children}
    </FileUploadDialogContext.Provider>
  );
};

export const useFileUploadDialog = () => {
  const context = useContext(FileUploadDialogContext);

  if (context === undefined) {
    throw new Error('This hook must be used inside FileUploadDialogProvider');
  }

  return context;
};
