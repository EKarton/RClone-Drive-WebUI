import { createContext, useContext, useState } from 'react';
import LoginHelpDialog from 'components/LoginHelpDialog/index';

const LoginHelpDialogContext = createContext();

export function LoginHelpDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <LoginHelpDialogContext.Provider value={{ openDialog }}>
      <LoginHelpDialog open={isOpen} onClose={closeDialog} />
      {children}
    </LoginHelpDialogContext.Provider>
  );
}

export function useLoginHelpDialog() {
  const context = useContext(LoginHelpDialogContext);

  if (context === undefined) {
    throw new Error('This hook must be wrapped in LoginHelpDialogProvider');
  }

  return context;
}
