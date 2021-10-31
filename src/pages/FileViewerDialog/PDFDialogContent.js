import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

export default function PDFDialogContent({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  const handlePdfLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Document
        file={fileUrl}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={handlePdfLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </>
  );
}
