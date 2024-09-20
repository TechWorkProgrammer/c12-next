import React, { FC, useState } from 'react';
import FilePreview from '@/components/common/FilePreview';
import { useAlert } from '@/contexts/AlertContext';
import { useTranslation } from "@/utils/useTranslation";

interface FileInputProps {
    onChange: (file: File | null) => void;
    accept?: string;
}

const FileInput: FC<FileInputProps> = ({ onChange, accept = '*' }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const alert = useAlert();
    const text = useTranslation();

    const handleFileChange = (selectedFile: File | null) => {
        if (file && selectedFile) {
            alert.warning(text('message:replace_file_confirmation'), false, () => {
                setFile(selectedFile);
                onChange(selectedFile);
            });
        } else {
            setFile(selectedFile);
            onChange(selectedFile);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        handleFileChange(selectedFile);
    };

    const handleRemoveFile = () => {
        alert.warning(text('message:remove_file_confirmation'), false, () => {
            setFile(null);
            onChange(null);
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 mb-4 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500
                ${dragActive ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        {text('content:input:file_input:label')}
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                    accept={accept}
                />
            </label>
            {file && (
                <FilePreview
                    fileName={file.name}
                    fileSize={file.size}
                    file={file}
                    onRemove={handleRemoveFile}
                />
            )}
        </div>
    );
};

export default FileInput;
