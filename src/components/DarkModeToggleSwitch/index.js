import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import MaterialUISwitch from './MaterialUISwitch';

export default function DarkModeToggleSwitch() {
  const colorMode = useColorMode();

  const handleSwitch = (e) => {
    if (e.target.checked) {
      colorMode.setMode(COLOR_MODE.DARK);
    } else {
      colorMode.setMode(COLOR_MODE.LIGHT);
    }
  };

  const isChecked = colorMode.mode === COLOR_MODE.DARK;

  return <MaterialUISwitch checked={isChecked} onChange={handleSwitch} size="small" />;
}

DarkModeToggleSwitch.propTypes = {};
