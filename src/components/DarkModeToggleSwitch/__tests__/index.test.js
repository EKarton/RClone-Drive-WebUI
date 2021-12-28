import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import { render, userEvent, screen } from 'test-utils/react';
import DarkModeToggleSwitch from '../index';

jest.mock('hooks/utils/useColorMode');

describe('DarkModeToggleSwitch', () => {
  it.each([COLOR_MODE.LIGHT, COLOR_MODE.DARK])(
    'should match snapshot given theme is %s',
    (mode) => {
      useColorMode.mockReturnValue({
        mode,
      });

      const { baseElement } = render(<DarkModeToggleSwitch />);

      expect(baseElement).toMatchSnapshot();
    }
  );

  it.each([
    [COLOR_MODE.LIGHT, COLOR_MODE.DARK],
    [COLOR_MODE.DARK, COLOR_MODE.LIGHT],
  ])(
    'should call useColorMode().setMode correctly when user clicks on the switch given initial theme is %s',
    (initialMode, expectedMode) => {
      const setMode = jest.fn();
      useColorMode.mockReturnValue({
        mode: initialMode,
        setMode,
      });

      render(<DarkModeToggleSwitch />);

      userEvent.click(screen.getByRole('checkbox'));

      expect(setMode).toBeCalledWith(expectedMode);
    }
  );
});
