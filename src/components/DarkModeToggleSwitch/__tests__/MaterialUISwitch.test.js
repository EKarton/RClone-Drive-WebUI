import { ThemeProvider, createTheme } from '@mui/material/styles';
import { COLOR_MODE } from 'utils/constants';
import { render } from 'test-utils/react';
import MaterialUISwitch from '../MaterialUISwitch';

describe('MaterialUISwitch', () => {
  it.each([COLOR_MODE.LIGHT, COLOR_MODE.DARK])(
    'should match snapshot given theme is %s',
    (mode) => {
      const theme = createTheme({
        palette: {
          mode,
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <MaterialUISwitch />
        </ThemeProvider>
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
