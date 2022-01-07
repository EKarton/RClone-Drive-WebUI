import FileSaver from 'file-saver';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { customRender, waitFor, userEvent, screen } from 'test-utils/react';
import PDFDialogContent from '../PDFDialogContent';
import TextDialogContent from '../TextDialogContent';
import FileViewerDialog from '../index';

jest.mock('hooks/rclone/useRCloneClient');
jest.mock('file-saver');
jest.mock('../PDFDialogContent');
jest.mock('../TextDialogContent');

describe('FileViewerDialog', () => {
  const defaultFileInfo = {
    remote: 'gdrive',
    dirPath: 'Pictures',
    fileName: 'profile.png',
  };

  const fetchFileContents = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFileContents,
    });

    URL.createObjectURL.mockReturnValue('blob://data');

    PDFDialogContent.mockReturnValue(null);
    TextDialogContent.mockReturnValue(null);
  });

  it('should match snapshot when api is not resolved yet', () => {
    fetchFileContents.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve('data'), 10000000000);
      });
    });

    const { baseElement } = renderComponent();

    expect(fetchFileContents).toBeCalledWith('gdrive', 'Pictures', 'profile.png');
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when fetching file fails', async () => {
    fetchFileContents.mockRejectedValue(new Error('Error!'));

    renderComponent();

    await screen.findByTestId('error-message');
  });

  it('should not make api call when dialog is open but no file info is set', () => {
    renderComponent(null);

    expect(fetchFileContents).not.toBeCalled();
  });

  it('should match snapshot and download file when fileInfo is an image', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const { baseElement } = renderComponent();

    await screen.findByTestId('image-content');
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot and download file when fileInfo is a pdf', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'application/pdf' },
    });

    renderComponent();

    await waitFor(() => {
      expect(PDFDialogContent).toBeCalled();
    });
  });

  it('should match snapshot when fileInfo is an unknown file type', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'application/octet-stream' },
    });

    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should call FileSaver.save() correctly when user clicks on the download button', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    renderComponent();
    userEvent.click(screen.getByTestId('download-button'));

    await waitFor(() => expect(FileSaver.saveAs).toBeCalled());
  });

  it('should match snapshot when user zooms into the dialog', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const { baseElement } = renderComponent();
    userEvent.click(screen.getByTestId('zoom-in-button'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when user zooms out of the dialog', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const { baseElement } = renderComponent();
    userEvent.click(screen.getByTestId('zoom-out-button'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onClose() when user clicks on the close button', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const view = renderComponent();
    userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() => expect(view.onClose).toBeCalled());
  });

  const renderComponent = (fileInfo = defaultFileInfo) => {
    const onClose = jest.fn();
    const view = customRender(
      <FileViewerDialog open fileInfo={fileInfo} onClose={onClose} />
    );

    view.onClose = onClose;

    return view;
  };
});
