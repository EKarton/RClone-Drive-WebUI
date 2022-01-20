import { customRender } from 'test-utils/react';
import Header from '../index';

describe('Header', () => {
  it('should render the header and jobs section given no jobs and mock remote and path', () => {
    const { baseElement } = customRender(<Header remote="gdrive" path="Documents" />);

    expect(baseElement).toMatchSnapshot();
  });
});
