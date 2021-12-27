import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createContext, useEffect, useMemo, useState } from 'react';
import { COLOR_MODE } from 'utils/constants';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function ColorModeProvider({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  //   const [mode, setMode] = useState(COLOR_MODE.LIGHT);
  const [mode, setMode] = useState(COLOR_MODE.DARK);

  //   useEffect(() => {
  //     setMode(prefersDarkMode ? 'dark' : 'light');
  //   }, [prefersDarkMode]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
      },
    });
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      return prevMode === COLOR_MODE.LIGHT ? COLOR_MODE.DARK : COLOR_MODE.LIGHT;
    });
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
