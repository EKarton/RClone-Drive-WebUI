import { JobTypes } from 'utils/constants';
import { render } from 'test-utils/react';
import TableRowIcon from '../TableRowIcon';

describe('TableRowIcon', () => {
  it.each([
    JobTypes.MOVE_FILE,
    JobTypes.MOVE_FOLDER,
    JobTypes.RENAME_FILE,
    JobTypes.RENAME_FOLDER,
    JobTypes.UPLOAD_FILE,
    'Random Job',
  ])('should match snapshot given job type is %s', (jobType) => {
    const { baseElement } = render(<TableRowIcon jobType={jobType} />);

    expect(baseElement).toMatchSnapshot();
  });
});
