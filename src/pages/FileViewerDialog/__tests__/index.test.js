import FileSaver from 'file-saver';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { customRender, waitFor, userEvent } from 'test-utils/react';
import PDFDialogContent from '../PDFDialogContent';
import FileViewerDialog from '..';

jest.mock('hooks/useRCloneClient');
jest.mock('file-saver');
jest.mock('../PDFDialogContent');

describe('FileViewerDialog', () => {
  const initialFileViewerState = {
    fileInfo: {
      remote: 'gdrive',
      folderPath: 'Pictures',
      fileName: 'profile.png',
    },
    isOpen: true,
  };

  const fetchFileContents = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFileContents,
    });

    URL.createObjectURL.mockReturnValue('blob://data');

    PDFDialogContent.mockReturnValue(null);
  });

  it('should match snapshot when api is not resolved yet', () => {
    fetchFileContents.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('data');
        }, 10000000000);
      });
    });

    const component = customRender(<FileViewerDialog />, { initialFileViewerState });

    expect(fetchFileContents).toBeCalledWith('gdrive', 'Pictures', 'profile.png');
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should not show dialog and not make api call when no file info is set', () => {
    const emptyFileViewerState = {
      fileInfo: undefined,
      isOpen: true,
    };

    customRender(<FileViewerDialog />, {
      initialFileViewerState: emptyFileViewerState,
    });

    expect(fetchFileContents).not.toBeCalled();
  });

  it('should match snapshot and download file when fileInfo is an image', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = customRender(<FileViewerDialog />, { initialFileViewerState });

    await waitFor(() => {
      expect(component.getByTestId('image-content')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should match snapshot and download file when fileInfo is a pdf', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'application/pdf' },
    });

    customRender(<FileViewerDialog />, { initialFileViewerState });

    await waitFor(() => {
      expect(PDFDialogContent).toBeCalled();
    });
  });

  it('should match snapshot when fileInfo is an unknown file type', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'application/json' },
    });

    const component = customRender(<FileViewerDialog />, { initialFileViewerState });

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should call FileSaver.save() correctly when user clicks on the download button', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = customRender(<FileViewerDialog />, { initialFileViewerState });

    userEvent.click(component.getByTestId('download-button'));

    await waitFor(() => {
      expect(FileSaver.saveAs).toBeCalled();
    });
  });

  it('should match snapshot when fetching file fails', async () => {
    fetchFileContents.mockRejectedValue(new Error('Error!'));

    const component = customRender(<FileViewerDialog />, { initialFileViewerState });

    await waitFor(() => {
      expect(component.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});
