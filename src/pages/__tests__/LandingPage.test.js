import { customRender } from 'test-utils';
import LandingPage from '../LandingPage';

describe('LandingPage', () => {
  it('should match snapshot', () => {
    const { baseElement } = customRender(<LandingPage />);

    expect(baseElement).toMatchSnapshot();
  });
});
