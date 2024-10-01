import { customRender, userEvent, waitFor, screen } from 'test-utils/react';
import GlobalAppBar from '..';

describe('GlobalAppBar', () => {
  it('should match snapshot', () => {
    const { baseElement } = customRender(
      <GlobalAppBar onDrawerButttonClicked={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call match snapshot', async () => {
    const onDrawerButttonClicked = jest.fn();

    customRender(<GlobalAppBar onDrawerButttonClicked={onDrawerButttonClicked} />);

    userEvent.click(screen.getByTestId('nav-button'));

    await waitFor(() => expect(onDrawerButttonClicked).toBeCalled());
  });
});
