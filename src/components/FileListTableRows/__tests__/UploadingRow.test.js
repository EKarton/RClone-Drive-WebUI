import { BehaviorSubject } from 'rxjs';
import { UploadStatusTypes } from 'utils/constants';
import { render, act, fireEvent, userEvent, screen } from 'test-utils/react';
import UploadingRow from '../UploadingRow';

describe('UploadingRow', () => {
  const baseFile = {
    name: 'dog.png',
    size: 10000,
    isDirectory: false,
    isImage: true,
    uploadStatus: new BehaviorSubject(UploadStatusTypes.UPLOADING),
  };

  it('should match snapshot given a file', () => {
    const fileObj = { ...baseFile };

    const { baseElement } = render(
      <UploadingRow file={fileObj} onFileOpen={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given a directory', () => {
    const fileObj = {
      ...baseFile,
      name: '2021',
      isDirectory: true,
      isImage: false,
    };

    const { baseElement } = render(<UploadingRow file={fileObj} />);

    expect(baseElement).toMatchSnapshot();
  });

  it.each(Object.values(UploadStatusTypes))(
    'should match snapshot given the upload status is %s',
    (status) => {
      const fileObj = {
        ...baseFile,
        uploadStatus: new BehaviorSubject(status),
      };

      const { baseElement } = render(<UploadingRow file={fileObj} />);

      expect(baseElement).toMatchSnapshot();
    }
  );

  it('should update snapshot when file status updates', () => {
    const fileObj = { ...baseFile };

    const { baseElement } = render(<UploadingRow file={fileObj} />);

    act(() => fileObj.uploadStatus.next(UploadStatusTypes.SUCCESS));

    expect(baseElement).toMatchSnapshot();
  });
});
