import { useContext } from 'react';
import { FileUploaderContext } from './index';

export default function useFileUploader() {
  const context = useContext(FileUploaderContext);

  if (!context) {
    throw new Error('This hook must be used inside FileUploaderContextProvider');
  }

  return context;
}
