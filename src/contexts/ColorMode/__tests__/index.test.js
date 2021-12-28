import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import { render, userEvent, screen } from 'test-utils/react';
import { ColorModeProvider } from '../index';

jest.mock('@mui/material/useMediaQuery');

describe('ColorMode', () => {
  beforeEach(() => {
    useMediaQuery.mockReturnValue(true);
  });

  it('should match snapshot and set theme to dark mode given system theme is dark mode', () => {
    renderComponent();

    expect(screen.getByText('Value: dark')).toBeInTheDocument();
  });

  it('should match snapshot and set theme to light mode given system theme is light mode', () => {
    useMediaQuery.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('Value: light')).toBeInTheDocument();
  });

  it('should change theme to dark mode when user clicks on "Toggle Color Mode" button given theme is light mode', () => {
    useMediaQuery.mockReturnValue(false);

    renderComponent();

    userEvent.click(screen.getByText('Toggle Color Mode'));

    expect(screen.getByText('Value: dark')).toBeInTheDocument();
  });

  it('should change theme to light mode when user clicks on "Toggle Color Mode" given theme is dark mode', () => {
    renderComponent();

    userEvent.click(screen.getByText('Toggle Color Mode'));

    expect(screen.getByText('Value: light')).toBeInTheDocument();
  });

  const renderComponent = () => {
    return render(
      <ColorModeProvider>
        <MockPage />
      </ColorModeProvider>
    );
  };

  const MockPage = () => {
    const colorMode = useColorMode();

    return (
      <>
        <div data-testid="color-mode">Value: {colorMode.mode}</div>
        <Button onClick={colorMode.toggleColorMode}>Toggle Color Mode</Button>
        <Button onClick={() => colorMode.setMode(COLOR_MODE.DARK)}>
          Set to Dark Mode
        </Button>
        <Button onClick={() => colorMode.setMode(COLOR_MODE.LIGHT)}>
          Set to Light Mode
        </Button>
      </>
    );
  };
});
