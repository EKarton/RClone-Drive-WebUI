import { useContext } from 'react';
import { RenameFileDialogContext } from 'contexts/RenameFileDialog';

export default function useRenameFileDialog() {
  return useContext(RenameFileDialogContext);
}
