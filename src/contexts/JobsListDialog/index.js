import { createContext, useContext, useState } from 'react';
import JobsListDialog from 'components/JobsListDialog/index';

const JobsListDialogContext = createContext();

export function JobsListDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const show = () => {
    setIsOpen(true);
  };

  return (
    <JobsListDialogContext.Provider value={{ show }}>
      <JobsListDialog open={isOpen} onClose={handleClose} />
      {children}
    </JobsListDialogContext.Provider>
  );
}

export function useJobsListDialog() {
  const context = useContext(JobsListDialogContext);

  if (context === undefined) {
    throw new Error('This hook must be wrapped in a JobsListDialogProvider');
  }

  return context;
}
