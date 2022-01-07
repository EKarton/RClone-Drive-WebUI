import { BehaviorSubject } from 'rxjs';
import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import { useFileUploader } from 'contexts/FileUploader';
import { UploadStatusTypes } from 'utils/constants';
import { render, screen } from 'test-utils/react';
import FileUploadDialog from '../index';

const mockUploadFiles = [
  {
    remote: 'gdrive',
    dirPath: 'Documents',
    name: 'Dog.png',
    size: 10000,
    type: 'application/jpg',
    status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
    error: undefined,
    cancelUpload: jest.fn(),
  },
  {
    remote: 'gdrive',
    dirPath: 'Documents',
    name: 'Dog.png',
    size: 10000,
    type: 'application/jpg',
    status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
    error: undefined,
    cancelUpload: jest.fn(),
  },
  {
    remote: 'gdrive',
    dirPath: 'Documents',
    name: 'Dog.png',
    size: 10000,
    type: 'application/jpg',
    status: new BehaviorSubject(UploadStatusTypes.SUCCESS),
    error: undefined,
    cancelUpload: jest.fn(),
  },
];

const mockCounts = {
  numUploading: 2,
  numSuccessful: 1,
  numFailed: 0,
  numCancelled: 0,
};

jest.mock('contexts/FileUploadCounts');
jest.mock('contexts/FileUploader');

describe('FileUploadDialog', () => {
  it('should match snapshot given uploading files and upload counts', async () => {
    useFileUploader.mockReturnValue({ files: mockUploadFiles });
    useFileUploadCounts.mockReturnValue({ counts: mockCounts });

    const { baseElement } = render(<FileUploadDialog open onClose={jest.fn()} />);

    await screen.findByTestId('file-upload-dialog');
    expect(baseElement).toMatchSnapshot();
  });
});
