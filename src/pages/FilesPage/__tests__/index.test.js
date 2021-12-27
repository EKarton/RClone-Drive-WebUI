import { customRender } from 'test-utils/react';
import FilesPage from '..';
import RemotesListSection from '../RemotesListSection';

jest.mock('../RemotesListSection');

describe('FilesPage', () => {
  it('should match snapshot', () => {
    RemotesListSection.mockReturnValue(null);

    const { baseElement } = customRender(<FilesPage />);

    expect(baseElement).toMatchSnapshot();
  });
});
