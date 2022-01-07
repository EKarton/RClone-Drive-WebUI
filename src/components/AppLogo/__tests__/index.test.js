import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import { render } from 'test-utils/react';
import AppLogo from '../index';

jest.mock('hooks/utils/useColorMode');

describe('AppLogo', () => {
  it.each(Object.values(COLOR_MODE))(
    'should match snapshot given color mode is %s',
    (colorMode) => {
      useColorMode.mockReturnValue({ mode: colorMode });

      const { baseElement } = render(<AppLogo />);

      expect(baseElement).toMatchSnapshot();
    }
  );
});
