import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Viewer from '@/components/common/Viewer';
import Custom404 from '@/pages/404';
import FileDisplay from "@/components/badges/FileDisplay";
import Input from "@/components/forms/Input";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import {useDateFormatter} from "@/utils/useDateFormatter";
import TextArea from "@/components/forms/TextArea";
import Button from "@/components/common/Button";
import {DetailLetterIn, Disposisi, DisposisiLevel2, DisposisiLevel3, LogDisposisi} from '@/interfaces/LetterIn';
import client from '@/api/client';
import StatusBadge from "@/components/badges/StatusBadge";
import {getCurrentUser} from "@/storage/auth";
import DisposisiModal from "@/components/common/DisposisiModal";
import {useAlert} from "@/contexts/AlertContext";
import History from "@/components/common/History";
import Skeleton from "@/components/common/Skeleton";
import withAuth from "@/hoc/withAuth";

const LetterInDetail: React.FC = () => {
    const router = useRouter();
    const user = getCurrentUser();
    const alert = useAlert();
    const dateFormat = useDateFormatter();
    const {uuid} = router.query;
    const [letter, setLetter] = useState<DetailLetterIn | null>(null);
    const [showDisposisiModal, setShowDisposisiModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLetterDetail = async () => {
            if (!uuid) return;
            try {
                const response = await client.get(`/surat-masuk/${uuid}`);
                setLetter(response.data);
            } catch (error) {
                console.error('Failed to fetch letter details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLetterDetail().then();
    }, [uuid]);

    if (isLoading) return <Skeleton/>;
    else if (!letter) return <Custom404/>;

    const getStatus = (item: DetailLetterIn) => {
        const {user_status} = item;
        if (user_status.pelaksanaan_at) {
            return 'dilaksanakan';
        }
        if (user_status.read_at) {
            return 'dibaca';
        }
        return 'belum dibaca';
    };

    const isPdf = letter.file_surat.toLowerCase().endsWith('.pdf');

    const checkIfUserHasDisposisi = (disposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3 | null, userUuid: string): boolean => {
        if (!disposisi) {
            return false;
        }
        if (disposisi.creator.uuid === userUuid) {
            return true;
        }
        if ('disposisi_level2' in disposisi) {
            for (const level2 of disposisi.disposisi_level2) {
                if (checkIfUserHasDisposisi(level2, userUuid)) {
                    return true;
                }
            }
        }
        if ('disposisi_level3' in disposisi) {
            for (const level3 of disposisi.disposisi_level3) {
                if (checkIfUserHasDisposisi(level3, userUuid)) {
                    return true;
                }
            }
        }
        return false;
    };

    const canUserDisposisi = (disposisi: Disposisi | null, userUuid: string, letterPenerimaUuid: string): boolean => {
        if (!disposisi) {
            return userUuid === letterPenerimaUuid;
        }

        const checkLogDisposisi = (logs: LogDisposisi[]) =>
            logs.some(log => log.penerima_user.uuid === userUuid);

        if (checkIfUserHasDisposisi(disposisi, userUuid)) {
            return false;
        }

        if (userUuid === letterPenerimaUuid) {
            return true;
        }

        const canDisposisiLevel = (currentDisposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3): boolean => {
            if (!checkIfUserHasDisposisi(currentDisposisi, userUuid)) {
                return checkLogDisposisi(currentDisposisi.log_disposisis);
            }
            return false;
        };

        if (canDisposisiLevel(disposisi)) return true;

        for (const level2 of disposisi.disposisi_level2) {
            if (canDisposisiLevel(level2)) return true;

            for (const level3 of level2.disposisi_level3) {
                if (canDisposisiLevel(level3)) return true;
            }
        }

        return false;
    };

    const handleMarkAsDone = async () => {
        try {
            await client.put(`/surat-masuk/${uuid}/done`);
            setLetter(prev => prev ? {
                ...prev,
                user_status: {...prev.user_status, pelaksanaan_at: new Date().toISOString()}
            } : null);
            alert.success('Surat berhasil ditandai sebagai dilaksanakan.');
        } catch (error) {
            alert.warning(error.message || 'Gagal menandai sebagai dilaksanakan. Silakan coba lagi.');
        }
    };

    const userCanDisposisi = canUserDisposisi(letter.disposisi, user.uuid, letter.penerima.uuid);
    const hasUserDisposisi = checkIfUserHasDisposisi(letter.disposisi, user.uuid);

    return (
        <>
            <div className="flex flex-col-reverse lg:flex-row gap-6 mb-6">
                <section
                    className="flex-1 overflow-hidden border border-gray-300 rounded-lg dark:border-gray-600 w-full">
                    {isPdf ? (
                        <Viewer file={letter.file_surat}/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                            Preview Saat ini hanya untuk File PDF saja
                        </div>
                    )}
                </section>

                <aside
                    className="w-full lg:w-1/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-white shadow-md dark:bg-gray-800 h-fit">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-start gap-2 items-start text-gray-500">
                            <ClassificationBadge classification={letter.klasifikasi_surat.name}/>
                            <StatusBadge status={getStatus(letter)}/>
                        </div>
                        <DownloadButton fileName={letter.file_surat} fileUrl={letter.file_surat}/>
                    </div>
                    <FileDisplay fileName={letter.file_surat} label={letter.nomor_surat}/>
                    <div className="flex flex-col gap-2 mt-2">
                        <Input label="No Surat" value={letter.nomor_surat} disabled={true}/>
                        <TextArea label="Keterangan" value={letter.perihal} disabled={true}/>
                        <Input label="Dikirim oleh" value={letter.pengirim} disabled={true}/>
                        <Input label="Dibuat oleh" value={letter.creator.name} disabled={true}/>
                        <Input label="Dibuat pada" value={dateFormat(letter.tanggal_surat)} disabled={true}/>
                        <Input label="Dikirim pada" value={dateFormat(letter.created_at)} disabled={true}/>
                        {user.role === "Pejabat" ? (
                            hasUserDisposisi ? (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>Telah di Disposisikan</p>
                                </div>
                            ) : userCanDisposisi ? (
                                <Button
                                    label="Disposisikan Surat"
                                    onClick={() => setShowDisposisiModal(true)}
                                />
                            ) : (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>Surat ini tidak berhubungan dengan akun Anda</p>
                                </div>
                            )
                        ) : user.role === "Tata Usaha" && letter.creator.uuid === user.uuid ? (
                            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                <p>Surat telah diturunkan</p>
                            </div>
                        ) : user.role === "Pelaksana" ? (
                            letter.user_status.pelaksanaan_at ? (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>Telah ditandai selesai</p>
                                </div>
                            ) : (
                                <Button
                                    label="Tandai Sebagai Dilaksanakan"
                                    onClick={handleMarkAsDone}
                                />
                            )
                        ) : (
                            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                <p>Surat ini tidak berhubungan dengan akun Anda</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <History letter={letter}/>
            {showDisposisiModal && (
                <DisposisiModal
                    onClose={() => setShowDisposisiModal(false)}
                    letter={letter}
                />
            )}
        </>
    );
};

export default withAuth(LetterInDetail, ["Tata usaha", "Pejabat", "Pelaksana"]);
