import { Routes, Route } from 'react-router';
import LazyImageList from 'components/LazyImageList';
import useFetchPictures from 'hooks/fetch-data/useFetchPictures';
import { StatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import { mockPictures } from 'test-utils/mock-responses';
import { customRender } from 'test-utils/react';
import PicturesListPage from '../index';

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
    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  const renderComponent = () => {
    const route = `/pictures/${hashRemotePath(`${remote}:`)}`;

    const initialRCloneInfoState = {
      endpoint: 'http://localhost:5572',
      username: 'local',
      password: '1234',
    };

    const component = (
      <Routes>
        <Route path="/pictures/:id" element={<PicturesListPage />} />
      </Routes>
    );

    return customRender(component, { initialRCloneInfoState }, { route });
  };
});
