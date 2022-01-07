import cx from 'classnames';
import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import './index.scss';

export default function AppLogo() {
  const { mode } = useColorMode();

  return (
    <div
      className={cx('app-logo', {
        'app-logo--dark': mode === COLOR_MODE.DARK,
      })}
    />
  );
}

AppLogo.propTypes = {};
