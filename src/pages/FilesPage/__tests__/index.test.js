import RemotesListSection from 'components/RemotesListSection';
import { customRender } from 'test-utils/react';
import FilesPage from '../index';

jest.mock('components/RemotesListSection');

describe('FilesPage', () => {
  it('should match snapshot', () => {
    RemotesListSection.mockReturnValue(null);

    const { baseElement } = customRender(<FilesPage />);

    expect(baseElement).toMatchSnapshot();
  });
});
