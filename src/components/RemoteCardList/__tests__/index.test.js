import RemoteCard from 'components/RemoteCard';
import { mockRemotes } from 'test-utils/mock-responses';
import { customRender } from 'test-utils/react';
import RemoteCardList from '..';

jest.mock('components/RemoteCard');

describe('RemoteCardList', () => {
  it('should render all remotes correctly given a list of remotes', () => {
    RemoteCard.mockImplementation(({ remote }) => {
      return <div>{remote}</div>;
    });

    const { baseElement } = customRender(
      <RemoteCardList remotes={mockRemotes.remotes} onClick={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onClick() correctly when user clicks on a RemoteCard', () => {
    RemoteCard.mockImplementation(({ remote, onClick }) => {
      if (remote === 'googledrive') {
        onClick();
      }

      return <div>{remote}</div>;
    });

    const onClickFn = jest.fn();
    customRender(<RemoteCardList remotes={mockRemotes.remotes} onClick={onClickFn} />);

    expect(onClickFn).toBeCalledWith('googledrive');
  });
});
