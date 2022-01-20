import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import { render, act } from 'test-utils/react';
import UploadingRow from '../UploadingRow';

describe('UploadingRow', () => {
  it('should match snapshot given a file', () => {
    const { baseElement } = render(<UploadingRow file={createFile()} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given a directory', () => {
    const fileObj = {
      ...createFile(),
      name: '2021',
      isDirectory: true,
    };

    const { baseElement } = render(<UploadingRow file={fileObj} />);

    expect(baseElement).toMatchSnapshot();
  });

  it.each(Object.values(JobStatus))(
    'should match snapshot given job status is %s',
    (status) => {
      const fileObj = {
        ...createFile(),
        status: new BehaviorSubject(status),
      };

      const { baseElement } = render(<UploadingRow file={fileObj} />);

      expect(baseElement).toMatchSnapshot();
    }
  );

  it('should update snapshot when file status updates', () => {
    const fileObj = createFile();

    const { baseElement } = render(<UploadingRow file={fileObj} />);

    act(() => fileObj.status.next(JobStatus.SUCCESS));

    expect(baseElement).toMatchSnapshot();
  });

  const createFile = () => ({
    name: 'dog.png',
    isDirectory: false,
    status: new BehaviorSubject(JobStatus.ONGOING),
  });
});
