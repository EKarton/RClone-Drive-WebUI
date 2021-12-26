import FilesListPage from '../index';
import useFetchFiles from 'hooks/rclone/fetch-data/useFetchFiles';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender } from 'test-utils/react';
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