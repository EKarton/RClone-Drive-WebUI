import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import { mockRemotes } from 'test-utils/mock-responses';
import { customRender, userEvent, screen } from 'test-utils/react';
import RemotesListSection from '..';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('hooks/fetch-data/useFetchRemoteInfo');
jest.mock('hooks/fetch-data/useFetchRemoteSpaceInfo');

describe('RemotesListSection', () => {
  beforeEach(() => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });

    useFetchRemoteSpaceInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockOperationsAboutResponse,
    });

    useFetchRemoteInfo.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockConfigGetResponse,
    });
  });

  it('should match snapshot when api call was successful', async () => {
    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should throw an error when api call fails', async () => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Error!'),
    });

    expect(renderComponent).toThrowError();
  });

  it('should match snapshot when api call is loading', async () => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onRemoteCardClicked() correctly when user clicks on a card', async () => {
    const view = renderComponent();

    userEvent.click(screen.getByText('googledrive'));

    expect(view.onRemoteCardClicked).toBeCalledWith('googledrive');
  });

  const renderComponent = () => {
    const onRemoteCardClicked = jest.fn();
    const view = customRender(
      <RemotesListSection onRemoteCardClicked={onRemoteCardClicked} />
    );

    view.onRemoteCardClicked = onRemoteCardClicked;
    return view;
  };
});
