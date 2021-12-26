import FilesListPage from '../index';
import useFetchFiles from 'hooks/rclone/fetch-data/useFetchFiles';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender, userEvent, fireEvent } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';
import { Route, Switch } from 'react-router';

jest.mock('hooks/rclone/fetch-data/useFetchFiles');
jest.mock('hooks/rclone/useRCloneClient');

describe('FilesListPage', () => {
  beforeEach(() => {
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
    });
  });

  it('should match snapshot', () => {
    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  //   it('should display rename file dialog when user right clicks on a table row and selects Move', () => {
  //     const component = renderComponent();

  //     fireEvent.contextMenu(component.getByTestId('Documents'));
  //     userEvent.click(component.getByTestId('move'));

  //     expect(component.getByTestId('move-file-dialog')).toBeVisible();
  //   });

  //   it('should display move file dialog when user right clicks on a table row and selects Rename', () => {
  //     const component = renderComponent();

  //     fireEvent.contextMenu(component.getByTestId('Documents'));
  //     userEvent.click(component.getByTestId('rename'));

  //     expect(component.getByTestId('rename-file-dialog')).toBeVisible();
  //   });

  const renderComponent = () => {
    const route = '/files/Z2RyaXZlOlBpY3R1cmVzLzIwMjE=';
    const component = (
      <Switch>
        <Route path="/files/:id">
          <FilesListPage />
        </Route>
      </Switch>
    );

    return customRender(component, {}, { route });
  };
});
