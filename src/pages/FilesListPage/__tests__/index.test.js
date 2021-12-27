import { Route, Switch } from 'react-router';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import { StatusTypes } from 'utils/constants';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender } from 'test-utils/react';
import FilesListPage from '../index';

jest.mock('hooks/fetch-data/useFetchFiles');
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
