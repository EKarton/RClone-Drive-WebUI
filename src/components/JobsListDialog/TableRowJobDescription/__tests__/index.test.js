import { JobStatus } from 'services/RCloneJobTracker/constants';
import { render } from 'test-utils/react';
import TableRowDescription from '../index';

describe('TableRowJobDescription', () => {
  it.each([
    'MOVE_FILE',
    'MOVE_FOLDER',
    'RENAME_FILE',
    'RENAME_FOLDER',
    'UPLOAD_FILE',
    'Random job',
  ])('should contain expected string given job type is %s', (jobType) => {
    const { baseElement } = render(
      <TableRowDescription
        status={JobStatus.ONGOING}
        job={{
          jobType,
          src: {},
          target: {},
          remote: '',
          dirPath: '',
          name: '',
        }}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
