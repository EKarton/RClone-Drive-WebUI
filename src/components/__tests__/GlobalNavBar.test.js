import { customRender } from 'test-utils';
import GlobalNavBar from '../GlobalNavBar';

describe('GlobalNavBar', () => {
  it.each(['/files', '/files/123', '/pictures', '/pictures/123'])(
    'should match snapshot given route is at %s',
    (route) => {
      const { baseElement } = customRender(<GlobalNavBar />, {}, { route });

      expect(baseElement).toMatchSnapshot();
    }
  );
});
