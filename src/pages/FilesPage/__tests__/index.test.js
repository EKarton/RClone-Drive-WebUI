import { customRender } from 'test-utils/react';
import RemotesListSection from '../RemotesListSection';
import FilesPage from '..';

jest.mock('../RemotesListSection');

describe('FilesPage', () => {
  it('should match snapshot', () => {
    RemotesListSection.mockReturnValue(null);

    const { baseElement } = customRender(<FilesPage />);

    expect(baseElement).toMatchSnapshot();
  });
});
