import FileSaver from 'file-saver';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { customRender, waitFor, userEvent } from 'test-utils/react';
import FileViewerDialog from '..';
import PDFDialogContent from '../PDFDialogContent';
import TextDialogContent from '../TextDialogContent';

jest.mock('hooks/rclone/useRCloneClient');
jest.mock('file-saver');
jest.mock('../PDFDialogContent');
jest.mock('../TextDialogContent');

describe('FileViewerDialog', () => {
  const defaultFileInfo = {
    remote: 'gdrive',
    folderPath: 'Pictures',
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

    const component = renderComponent();

    expect(fetchFileContents).toBeCalledWith('gdrive', 'Pictures', 'profile.png');
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should match snapshot when fetching file fails', async () => {
    fetchFileContents.mockRejectedValue(new Error('Error!'));

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByTestId('error-message')).toBeInTheDocument();
    });
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

    const component = renderComponent();

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

    const component = renderComponent();

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should call FileSaver.save() correctly when user clicks on the download button', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = renderComponent();
    userEvent.click(component.getByTestId('download-button'));

    await waitFor(() => {
      expect(FileSaver.saveAs).toBeCalled();
    });
  });

  it('should match snapshot when user zooms into the dialog', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = renderComponent();
    userEvent.click(component.getByTestId('zoom-in-button'));

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should match snapshot when user zooms out of the dialog', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = renderComponent();
    userEvent.click(component.getByTestId('zoom-out-button'));

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should call onClose() when user clicks on the close button', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'image/jpeg' },
    });

    const component = renderComponent();
    userEvent.click(component.getByTestId('close-button'));

    await waitFor(() => {
      expect(component.onClose).toBeCalled();
    });
  });

  const renderComponent = (fileInfo = defaultFileInfo) => {
    const onClose = jest.fn();
    const component = customRender(
      <FileViewerDialog open fileInfo={fileInfo} onClose={onClose} />
    );

    component.onClose = onClose;

    return component;
  };
});
