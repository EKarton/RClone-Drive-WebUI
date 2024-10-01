import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import { render, userEvent, waitFor, screen } from 'test-utils/react';
import { ColorModeProvider } from '../index';

jest.mock('@mui/material/useMediaQuery');

describe('ColorMode', () => {
  beforeEach(() => {
    useMediaQuery.mockReturnValue(true);
  });

  it('should match snapshot and set theme to dark mode given system theme is dark mode', async () => {
    renderComponent();

    await screen.findByText('Value: dark');
  });

  it('should match snapshot and set theme to light mode given system theme is light mode', async () => {
    useMediaQuery.mockReturnValue(false);

    renderComponent();

    await screen.findByText('Value: light');
  });

  it('should change theme to dark mode when user clicks on "Toggle Color Mode" button given theme is light mode', async () => {
    useMediaQuery.mockReturnValue(false);

    renderComponent();

    userEvent.click(screen.getByText('Toggle Color Mode'));

    await screen.findByText('Value: dark');
  });

  it('should change theme to light mode when user clicks on "Toggle Color Mode" given theme is dark mode', async () => {
    renderComponent();

    userEvent.click(screen.getByText('Toggle Color Mode'));

    await screen.findByText('Value: light');
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
