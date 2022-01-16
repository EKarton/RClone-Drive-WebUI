import { render } from 'test-utils/react';
import TableRowIcon from '../TableRowIcon';

describe('TableRowIcon', () => {
  it.each([
    'MOVE_FILE',
    'MOVE_FOLDER',
    'RENAME_FILE',
    'RENAME_FOLDER',
    'UPLOAD_FILE',
    'Random Job',
  ])('should match snapshot given job type is %s', (jobType) => {
    const { baseElement } = render(<TableRowIcon jobType={jobType} />);

    expect(baseElement).toMatchSnapshot();
  });
});
