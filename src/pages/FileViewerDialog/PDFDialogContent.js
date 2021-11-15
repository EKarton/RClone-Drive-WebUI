import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import { useState } from 'react';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';

export default function PDFDialogContent({ fileUrl }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const handlePdfLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setHasLoaded(true);
  };

  const renderAllPages = () => {
    return Array.from(new Array(numPages), (el, index) => (
      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
    ));
  };

  return (
    <>
      <Document
        file={fileUrl}
        options={{ workerSrc: '/pdf.worker.js' }}
        onLoadSuccess={handlePdfLoadSuccess}
      >
        {hasLoaded && renderAllPages()}
      </Document>
    </>
  );
}