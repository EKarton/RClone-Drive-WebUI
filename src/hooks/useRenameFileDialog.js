import { useContext } from 'react';
import { RenameFileDialogContext } from 'contexts/RenameFileDialog';

export default function useRenameFileDialog() {
  const context = useContext(RenameFileDialogContext);

  if (context === undefined) {
    throw new Error('useRenameFileDialog() must be used within a FileRenamerProvider');
  }

  return context;
}
