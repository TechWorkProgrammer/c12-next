import React, { FC, useState } from 'react';
import FilePreview from '@/components/common/FilePreview';
import { useAlert } from '@/contexts/AlertContext';

interface FileInputProps {
    onChange: (file: File | null) => void;
    accept?: string;
}

const FileInput: FC<FileInputProps> = ({ onChange, accept = '*' }) => {
    const [file, setFile] = useState<File | null>(null);
    const alert = useAlert();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (file && selectedFile) {
            alert.warning('File sebelumnya akan terganti, apakah kamu yakin?', false, () => {
                setFile(selectedFile);
                onChange(selectedFile);
            });
        } else {
            setFile(selectedFile);
            onChange(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        alert.warning('Apakah kamu yakin ingin menghapus file ini?', false, () => {
            setFile(null);
            onChange(null);
        });
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 mb-4 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
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
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Pilih file yang ingin di upload</span> atau tarik file ke area ini
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        (terima beberapa format file seperti .pdf, .docx, dll.)
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
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
