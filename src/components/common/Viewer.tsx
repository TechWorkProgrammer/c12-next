import {FC, useEffect, useState} from 'react';
import Image from 'next/image';
import Skeleton from "@/components/common/Skeleton";

interface ViewerProps {
    file: File | string;
}

const Viewer: FC<ViewerProps> = ({file}) => {
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
            <Skeleton type={'file'}/>
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
                    <source src={fileUrl} type={fileType}/>
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (['mp3', 'wav', 'ogg'].some(ext => fileType.includes(ext))) {
            return (
                <audio controls className="w-full">
                    <source src={fileUrl} type={fileType}/>
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
