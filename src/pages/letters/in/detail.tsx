import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import PDFViewer from '@/components/preview/PDFViewer';
import Custom404 from '@/pages/404';
import data from '@/data/letters.json';
import FileDisplay from "@/components/badges/FileDisplay";
import Input from "@/components/forms/Input";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import {dateFormatter} from "@/utils/dateFormatter";
import TextArea from "@/components/forms/TextArea";
import Button from "@/components/common/Button";
import History from "@/components/common/History";

const LetterInDetail = () => {
    const router = useRouter();
    const {id} = router.query;
    const [letter, setLetter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const selectedLetter = data.find((item) => item.id === id);
            if (selectedLetter) {
                setLetter(selectedLetter);
            }
            setIsLoading(false);
        }
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!letter) return <Custom404/>;

    const isPdf = letter.fileName.toLowerCase().endsWith('.pdf');

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Detail Surat {letter.noSurat}</h1>
            <div className="flex flex-col-reverse lg:flex-row gap-4 mb-4">
                <section className="flex-1 overflow-hidden border border-dashed rounded-lg h-fit w-fit">
                    {isPdf ? (
                        <PDFViewer file={letter.fileUrl}/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                            Preview Saat ini hanya untuk File PDF saja
                        </div>
                    )}
                </section>

                <aside className="w-full lg:w-1/3 border rounded-lg p-4 bg-white shadow-md dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-start gap-2 items-start text-gray-500">
                            <ClassificationBadge classification={letter.classification}/>
                            <StatusBadge status={letter.status}/>
                        </div>
                        <DownloadButton fileName={letter.fileName} fileUrl={letter.fileUrl}/>
                    </div>
                    <FileDisplay fileName={letter.fileName} label={letter.fileName}/>
                    <div className="flex flex-col gap-2">
                        <Input label="No Surat" value={letter.noSurat} disabled={true}/>
                        <Input label="Kondisi Disposisi"
                               value={letter.disposisi.length > 0 ? `Disposisi Level ${letter.disposisi[letter.disposisi.length -1].level}` : 'Belum pernah di disposisikan'}
                               disabled={true}/>
                        <TextArea label="Keterangan" value={letter.keteranganSurat} disabled={true}/>
                        <Input label="Dibuat oleh" value={letter.createdBy} disabled={true}/>
                        <Input label="Dibuat pada" value={dateFormatter(letter.createdAt)} disabled={true}/>
                        {(letter.status == "dibaca" || letter.status == "belum dibaca") && letter.disposisi[letter.disposisi.length -1].level !== 3 ? (<Button label="Disposisikan Surat" onClick={() => {/* handle disposisi */}}/>) : (<div className="text-center text-sm text-gray-700 dark:text-gray-300">Surat Ini Sudah tidak dapat di disposisikan</div>)}
                    </div>
                </aside>
            </div>
            <History disposisi={letter.disposisi} />
        </>
    );
};

export default LetterInDetail;
