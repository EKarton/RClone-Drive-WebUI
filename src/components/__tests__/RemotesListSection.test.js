import RemoteCardList from 'components/RemoteCardList';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';
import { mockRemotes } from 'test-utils/mock-responses';
import { customRender, waitFor } from 'test-utils/react';
import RemotesListSection from '../RemotesListSection';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('components/RemoteCardList');

describe('RemotesListSection', () => {
  beforeEach(() => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });

    RemoteCardList.mockImplementation(({ remotes }) => {
      return <div>{remotes.join(',')}</div>;
    });
  });

  it('should match snapshot when api call was successful', async () => {
    const component = renderComponent();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should match snapshot when api call failed', async () => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Error!'),
    });

    const component = renderComponent();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should match snapshot when api call is loading', async () => {
    useFetchRemotes.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const component = renderComponent();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should go to the files page when user clicks on a remote', async () => {
    // Mock the timer to prevent calling onClick immediately
    jest.useFakeTimers();

    RemoteCardList.mockImplementation(({ remotes, onClick }) => {
      setTimeout(() => onClick('googledrive'), 10000);
      return <div>{remotes.join(',')}</div>;
    });

    const component = renderComponent();

    // Mimic user clicking on the buttotn
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.onRemoteCardClicked).toBeCalledWith('googledrive');
    });
  });

  const renderComponent = () => {
    const onRemoteCardClicked = jest.fn();
    const component = customRender(
      <RemotesListSection onRemoteCardClicked={onRemoteCardClicked} />
    );

    component.onRemoteCardClicked = onRemoteCardClicked;
    return component;
  };
});
