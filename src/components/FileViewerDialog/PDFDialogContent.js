import PropTypes from 'prop-types';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFDialogContent.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
    <Document file={fileUrl} onLoadSuccess={handlePdfLoadSuccess}>
      {hasLoaded && renderAllPages()}
    </Document>
  );
}

PDFDialogContent.propTypes = {
  fileUrl: PropTypes.string,
};
