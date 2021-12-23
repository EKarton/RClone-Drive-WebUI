import { useContext } from 'react';
import { MoveFileDialogContext } from 'contexts/MoveFileDialog';

export default function useMoveFileDialog() {
  return useContext(MoveFileDialogContext);
}
