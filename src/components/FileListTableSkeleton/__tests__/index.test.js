import { render } from 'test-utils/react';
import FileListTableSkeleton from '..';

describe('FileListTableSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<FileListTableSkeleton />);

    expect(baseElement).toMatchSnapshot();
  });
});
