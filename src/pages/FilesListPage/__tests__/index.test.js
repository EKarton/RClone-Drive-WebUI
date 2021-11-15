import useFileViewer from 'hooks/useFileViewer';
import useRCloneClient from 'hooks/useRCloneClient';
import { Route } from 'react-router';
import { customRender, userEvent, waitFor } from 'test-utils';
import { mockFiles } from 'utils/mock-files';
import { hashRemotePath } from 'utils/remote-paths-url';
import FilesListPage from '..';

jest.mock('hooks/useRCloneClient');
jest.mock('hooks/useFileViewer');

describe('FilesListPage', () => {
  const remote = 'googledrive';
  const route = `/files/${hashRemotePath(`${remote}:`)}`;

  const fetchFilesFn = jest.fn();
  const showFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFiles: fetchFilesFn,
    });

    useFileViewer.mockReturnValue({
      show: showFn,
    });
  });

  it('should match screenshots when api call loads and succeeds', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Mock api call that takes 10000ms
    fetchFilesFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockFiles.list);
        }, 10000);
      });
    });

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByTestId('fileslisttableskeleton')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });

    // Resolve api call
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.getByTestId('fileslisttable')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should go to correct url when user clicks on a folder', async () => {
    fetchFilesFn.mockResolvedValue(mockFiles.list);

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByTestId('fileslisttable')).toBeInTheDocument();

      // Mimic user clicking on a folder
      userEvent.click(component.getByTestId('Documents'));

      // Check that user went to the correct page
      const expectedPath = `/files/${hashRemotePath(`${remote}:Documents`)}`;
      expect(component.history.location.pathname).toEqual(expectedPath);
    });
  });

  it('should call fileViewer.show when user clicks on a file', async () => {
    fetchFilesFn.mockResolvedValue(mockFiles.list);

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByTestId('fileslisttable')).toBeInTheDocument();

      // Mimic user clicking on a folder
      userEvent.click(component.getByTestId('backup.sh'));

      // Check that the fileviewer was opened
      expect(showFn).toBeCalledWith({
        remote,
        folderPath: '',
        fileName: 'backup.sh',
      });
    });
  });

  const renderComponent = () => {
    const component = (
      <Route path="/files/:id">
        <FilesListPage />
      </Route>
    );

    return customRender(component, {}, { route });
  };
});
