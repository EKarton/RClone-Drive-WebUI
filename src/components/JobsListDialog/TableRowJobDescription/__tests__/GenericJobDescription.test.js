import { JobStatus } from 'utils/constants';
import { render } from 'test-utils/react';
import GenericJobDescription from '../GenericJobDescription';

describe('GenericJobDescription', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given status is %s',
    (status) => {
      const { baseElement } = render(<GenericJobDescription status={status} />);

      expect(baseElement).toMatchSnapshot();
    }
  );
});
