import useScrollTrigger from '@mui/material/useScrollTrigger';
import { customRender } from 'test-utils/react';
import LandingPage from '../index';

jest.mock('@mui/material/useScrollTrigger');

describe('LandingPage', () => {
  beforeEach(() => {
    useScrollTrigger.mockReturnValue(false);
  });

  it('should match snapshot', () => {
    const { baseElement } = customRender(<LandingPage />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when user scrolls down on the page', () => {
    useScrollTrigger.mockReturnValue(true);

    const { baseElement } = customRender(<LandingPage />);

    expect(baseElement).toMatchSnapshot();
  });
});
