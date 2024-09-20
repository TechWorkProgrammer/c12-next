import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

interface ViewerProps {
    file: File | string;
}

const Viewer: FC<ViewerProps> = ({ file }) => {
    const [fileUrl, setFileUrl] = useState<string>('');
    const [fileType, setFileType] = useState<string | undefined>('');

    useEffect(() => {
        if (typeof file === 'string') {
            setFileUrl(file);
            setFileType(file.split('.').pop()?.toLowerCase());
        } else if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFileUrl(objectUrl);
            setFileType(file.type);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    if (!fileUrl) {
        return (
            <div className="flex items-center animate-pulse justify-center max-w-sm w-56 h-40 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                >
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
            </div>
        );
    }

    const renderViewer = () => {
        if (!fileType)
            return (
                <div className="m-4 text-md font-semibold text-gray-900 dark:text-gray-300">
                    Unsupported file type.
                </div>
            );

        if (fileType.includes('pdf')) {
            return (
                <iframe
                    src={fileUrl}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                />
            );
        }

        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].some(ext => fileType.includes(ext))) {
            return (
                <Image
                    src={fileUrl}
                    alt="Image Preview"
                    className="max-w-lg w-auto max-h-[80vh]"
                    width={1280}
                    height={728}
                    loading="eager"
                />
            );
        }

        if (['mp4', 'webm', 'ogg'].some(ext => fileType.includes(ext))) {
            return (
                <video controls className="max-w-full max-h-[80vh]">
                    <source src={fileUrl} type={fileType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (['mp3', 'wav', 'ogg'].some(ext => fileType.includes(ext))) {
            return (
                <audio controls className="w-full">
                    <source src={fileUrl} type={fileType} />
                    Your browser does not support the audio element.
                </audio>
            );
        }

        if (
            ['msword', 'vnd.openxmlformats-officedocument', 'vnd.ms-powerpoint', 'vnd.ms-excel'].some(
                ext => fileType.includes(ext)
            )
        ) {
            if (typeof file === 'string') {
                return (
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                            fileUrl
                        )}`}
                        className="w-full h-[80vh]"
                        title="Document Preview"
                    />
                );
            } else {
                return (
                    <iframe
                        src={fileUrl}
                        className="w-full h-[80vh] border-none"
                        title="Office Document Preview"
                    />
                );
            }
        }

        return (
            <div className="m-4 text-md font-semibold text-gray-900 dark:text-gray-300">
                File type not supported for preview.
            </div>
        );
    };

    return <div className="h-full">{renderViewer()}</div>;
};

export default Viewer;
