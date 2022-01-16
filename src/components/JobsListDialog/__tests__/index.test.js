import { customRender } from 'test-utils/react';
import JobsListDialog from '../index';

describe('JobsListDialog', () => {
  it('should match snapshot given no jobs', () => {
    const { baseElement } = customRender(<JobsListDialog open onClose={jest.fn()} />);

    expect(baseElement).toMatchSnapshot();
  });
});
