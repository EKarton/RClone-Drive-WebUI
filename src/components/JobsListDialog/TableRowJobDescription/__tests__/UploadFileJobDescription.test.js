import { JobStatus } from 'utils/constants';
import { render } from 'test-utils/react';
import UploadJobDescription from '../UploadJobDescription';

describe('UploadJobDescription', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given status is %s',
    (status) => {
      const { baseElement } = render(
        <UploadJobDescription
          status={status}
          job={{
            remote: 'gdrive',
            dirPath: 'Documents',
            name: 'dog.png',
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
