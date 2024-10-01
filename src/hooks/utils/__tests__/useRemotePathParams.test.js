import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { hashRemotePath } from 'utils/remote-paths-url';
import useRemotePathParams from '../useRemotePathParams';

jest.mock('react-pdf', () => ({
  Document: jest.fn(() => null),
  Page: jest.fn(() => null),
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: 'mockedWorkerSrc',
    },
  },
}));

jest.mock('react-pdf/dist/Page/AnnotationLayer.css', () => ({}), { virtual: true });
jest.mock('react-pdf/dist/Page/TextLayer.css', () => ({}), { virtual: true });

describe('useRemotePathParams()', () => {
  it('should return correct values given url contains remote and full path', () => {
    const { result } = renderCustomHook('/files/Z2RyaXZlOlBpY3R1cmVzLzIwMjE=');

    expect(result.current).toEqual({ remote: 'gdrive', path: 'Pictures/2021' });
  });

  it('should throw an error given route is an invalid route', () => {
    const { result } = renderCustomHook('/files/1234');

    expect(result.error).toBeInstanceOf(Error);
  });

  it('should throw an error given route does not contain path', () => {
    const { result } = renderCustomHook(`/files/${hashRemotePath('googledrive')}`);

    expect(result.error).toBeInstanceOf(Error);
  });

  const renderCustomHook = (route) => {
    const wrapper = ({ children }) => {
      return (
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/files/:id" element={children} />
          </Routes>
        </MemoryRouter>
      );
    };

    return renderHook(() => useRemotePathParams(), { wrapper });
  };
});
