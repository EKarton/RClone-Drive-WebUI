import { BehaviorSubject } from 'rxjs';
import { UploadStatusTypes } from 'utils/constants';
import { render, act, userEvent, screen } from 'test-utils/react';
import TableRow from '../TableRow';

describe('TableRow', () => {
  it('should match snapshot given file is being uploaded', () => {
    const file = createBaseFile();
    const { baseElement } = render(<TableRow file={file} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should update snapshot when file status has changed given file is being uploaded', () => {
    const file = createBaseFile();
    const { baseElement } = render(<TableRow file={file} />);

    act(() => file.status.next(UploadStatusTypes.SUCCESS));

    expect(baseElement).toMatchSnapshot();
  });

  it('should call file.cancelUpload() when user clicks on cancel button given file is being uploaded', async () => {
    const file = createBaseFile();
    render(<TableRow file={file} />);

    userEvent.click(screen.getByTestId('cancel-upload-button'));

    expect(file.cancelUpload).toBeCalled();
  });

  const createBaseFile = () => ({
    remote: 'gdrive',
    dirPath: 'Documents',
    name: 'Dog.png',
    size: 10000,
    type: 'application/jpg',
    status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
    cancelUpload: jest.fn(),
  });
});
