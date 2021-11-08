import { pdfjs, Document, Page } from 'react-pdf';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
