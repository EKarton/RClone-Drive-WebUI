import { Document } from 'react-pdf';
import { customRender } from 'test-utils/react';
import PDFDialogContent from '../PDFDialogContent';

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

describe('PDFDialogContent', () => {
  it('should render pdf correctly', () => {
    Document.mockImplementation(({ onLoadSuccess, children }) => {
      onLoadSuccess(10);
      return children;
    });

    const { baseElement } = customRender(<PDFDialogContent fileUrl="file.pdf" />);

    expect(baseElement).toMatchSnapshot();
  });
});
