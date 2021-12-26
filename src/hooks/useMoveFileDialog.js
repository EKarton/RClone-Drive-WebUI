import { useContext } from 'react';
import { MoveFileDialogContext } from 'contexts/MoveFileDialog';

export default function useMoveFileDialog() {
  const context = useContext(MoveFileDialogContext);

  if (context === undefined) {
    throw new Error('useMoveFileDialog() must be used within a MoveFileDialogProvider');
  }

  return context;
}
