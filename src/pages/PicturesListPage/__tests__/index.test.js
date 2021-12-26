import LazyImageList from 'components/LazyImageList';
import { Route } from 'react-router';
import { customRender, waitFor } from 'test-utils/react';
import { mockPictures } from 'test-utils/mock-responses';
import { hashRemotePath } from 'utils/remote-paths-url';
import PicturesListPage from '..';
import useFetchPictures from 'hooks/fetch-data/useFetchPictures';
import { StatusTypes } from 'utils/constants';

jest.mock('hooks/fetch-data/useFetchPictures');
jest.mock('components/LazyImageList');

describe('PicturesListPage', () => {
  const remote = 'googledrive';

  beforeEach(() => {
    useFetchPictures.mockResolvedValue({
      status: StatusTypes.SUCCESS,
      data: mockPictures.list,
    });

    LazyImageList.mockReturnValue(null);
  });

  it('should not throw an error when the api call succeeds', async () => {
    const component = renderComponent();

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  const renderComponent = () => {
    const route = `/pictures/${hashRemotePath(`${remote}:`)}`;

    const initialRCloneInfoState = {
      endpoint: 'http://localhost:5572',
      username: 'local',
      password: '1234',
    };

    const component = (
      <Route path="/pictures/:id">
        <PicturesListPage />
      </Route>
    );

    return customRender(component, { initialRCloneInfoState }, { route });
  };
});
