import { Document } from 'react-pdf';
import { customRender } from 'test-utils/react';
import PDFDialogContent from '../PDFDialogContent';

jest.mock('react-pdf');

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
