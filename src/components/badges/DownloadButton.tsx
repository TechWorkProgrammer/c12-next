import React from 'react';

interface DownloadButtonProps {
    label?: boolean;
    fileUrl: string;
    fileName: string;
    onGeneratePDF?: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ label = false, fileUrl, fileName, onGeneratePDF }) => {
    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (onGeneratePDF) {
            onGeneratePDF();
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center p-1 rounded bg-blue-200 text-blue-800 font-bold text-sm hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            <svg
                className="w-4 h-4 text-blue-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                />
            </svg>
            {label && (<div className="ms-1">Download</div>)}
        </button>
    );
};

export default DownloadButton;
