import { useContext } from 'react';
import { ColorModeContext } from 'contexts/ColorMode/index';

export default function useColorMode() {
  const context = useContext(ColorModeContext);

  if (context === undefined) {
    throw new Error('useColorMode() needs to be used inside ColorModeProvider');
  }

  return context;
}
