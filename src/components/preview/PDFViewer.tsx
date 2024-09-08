import { useEffect, useState } from 'react';

const PDFViewer = ({ file }) => {
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        setPdfUrl(file);
    }, [file]);

    if (!pdfUrl) {
        return <div>Loading PDF...</div>;
    }

    return (
        <div className="h-full">
            <iframe
                src={pdfUrl}
                className="lg:w-full w-[92vw] h-[80vh]"
                title="PDF Preview"
            />
        </div>
    );
};

export default PDFViewer;
