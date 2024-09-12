import React, { FC, useState } from 'react';
import FileDisplay from '@/components/badges/FileDisplay';
import Modal from '@/components/common/Modal';
import Viewer from '@/components/common/Viewer';

interface FilePreviewProps {
    fileName: string;
    fileSize: number;
    onRemove: () => void;
    file: File | string;
}

const FilePreview: FC<FilePreviewProps> = ({ fileName, fileSize, onRemove, file }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-between gap-2 w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600">
            <div className="flex flex-col lg:gap-2 lg:flex-row">
                <FileDisplay fileName={fileName} label={fileName} />
                <span className="text-md text-gray-500 dark:text-gray-400 ps-7 lg:ps-4">
                    {(fileSize / 1024).toFixed(2)} KB
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsModalOpen(true)} className="text-gray-800 dark:text-white">
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"
                        />
                    </svg>
                </button>
                <button onClick={onRemove} className="ml-2">
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                    </svg>
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Viewer file={file} />
            </Modal>
        </div>
    );
};

export default FilePreview;
