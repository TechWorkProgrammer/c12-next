import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Viewer from '@/components/common/Viewer';
import Custom404 from '@/pages/404';
import data from '@/data/letters.json';
import FileDisplay from "@/components/badges/FileDisplay";
import Input from "@/components/forms/Input";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import { dateFormatter } from "@/utils/dateFormatter";
import TextArea from "@/components/forms/TextArea";
import Button from "@/components/common/Button";
import History from "@/components/common/History";
import DisposisiModal from "@/components/common/DisposisiModal";
import { LetterIn } from '@/interfaces/LetterIn';

const LetterInDetail: React.FC = () => {
    const router = useRouter();
    const { uuid } = router.query;
    const [letter, setLetter] = useState<LetterIn | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDisposisiModal, setShowDisposisiModal] = useState(false);

    useEffect(() => {
        if (uuid) {
            const selectedLetter = data.find((item) => item.uuid === uuid) as LetterIn;
            if (selectedLetter) {
                setLetter(selectedLetter);
            }
            setIsLoading(false);
        }
    }, [uuid]);

    if (isLoading) return <div>Loading...</div>;
    if (!letter) return <Custom404 />;

    const isPdf = letter.file_surat.toLowerCase().endsWith('.pdf');

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Detail Surat {letter.no_surat}
            </h1>
            <div className="flex flex-col-reverse lg:flex-row gap-6 mb-6">
                <section className="flex-1 overflow-hidden border border-gray-300 rounded-lg dark:border-gray-600 w-full">
                    {isPdf ? (
                        <Viewer file={letter.file_surat} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                            Preview Saat ini hanya untuk File PDF saja
                        </div>
                    )}
                </section>

                <aside className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-white shadow-md dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-start gap-2 items-start text-gray-500">
                            <ClassificationBadge classification={letter.klasifikasi_surat.name} />
                        </div>
                        <DownloadButton fileName={letter.file_surat} fileUrl={letter.file_surat} />
                    </div>
                    <FileDisplay fileName={letter.file_surat} label={letter.no_surat} />
                    <div className="flex flex-col gap-2 mt-2">
                        <Input label="No Surat" value={letter.no_surat} disabled={true} />
                        <Input
                            label="Kondisi Disposisi"
                            value={
                                letter.disposisi.length > 0
                                    ? `Disposisi Level ${letter.disposisi[letter.disposisi.length - 1].created_by.name}`
                                    : 'Belum pernah di disposisikan'
                            }
                            disabled={true}
                        />
                        <TextArea label="Keterangan" value={letter.perihal} disabled={true} />
                        <Input label="Dibuat oleh" value={letter.created_by.name} disabled={true} />
                        <Input label="Dibuat pada" value={dateFormatter(letter.tanggal_surat)} disabled={true} />
                        {(letter.read_at || !letter.read_at) ? (
                            <Button
                                label="Disposisikan Surat"
                                onClick={() => setShowDisposisiModal(true)}
                            />
                        ) : (
                            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                <p>Telah ditandai selesai</p>
                                <p>Pelaksanaan surat ini telah mencapai 50%.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <History letter={letter} />

            {showDisposisiModal && (
                <DisposisiModal
                    onClose={() => setShowDisposisiModal(false)}
                />
            )}
        </>
    );
};

export default LetterInDetail;
