import { useContext } from 'react';
import { FileViewerDialogContext } from 'contexts/FileViewerDialog';

export default function useFileViewerDialog() {
  const context = useContext(FileViewerDialogContext);

  if (context === undefined) {
    throw new Error('useFileViewer() should be used inside FileViewerDialogProvider');
  }

  return context;
}
