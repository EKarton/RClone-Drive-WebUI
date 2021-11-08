import { render } from 'test-utils';
import FileListTableSkeleton from '../FileListTableSkeleton';

describe('FileListTableSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<FileListTableSkeleton />);

    expect(baseElement).toMatchSnapshot();
  });
});
