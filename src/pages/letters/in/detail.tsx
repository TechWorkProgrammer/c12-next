import React, {useCallback, useEffect, useState} from 'react';
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
import {DetailLetterIn, Disposisi, DisposisiLevel2, DisposisiLevel3} from '@/interfaces/LetterIn';
import client from '@/api/client';
import StatusBadge from "@/components/badges/StatusBadge";
import {getCurrentUser} from "@/storage/auth";
import DisposisiModal from "@/components/common/DisposisiModal";
import {useAlert} from "@/contexts/AlertContext";
import Skeleton from "@/components/common/Skeleton";
import withAuth from "@/hoc/withAuth";
import {useTranslation} from "@/utils/useTranslation";
import History from "@/components/common/History";

const LetterInDetail: React.FC = () => {
    const router = useRouter();
    const user = getCurrentUser();
    const alert = useAlert();
    const dateFormat = useDateFormatter();
    const text = useTranslation();
    const {uuid} = router.query;
    const [letter, setLetter] = useState<DetailLetterIn | null>(null);
    const [showDisposisiModal, setShowDisposisiModal] = useState(false);
    const [parentDisposisi, setParentDisposisi] = useState<Disposisi | DisposisiLevel2 | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLetterDetail = useCallback(async () => {
        if (!uuid) return;
        try {
            const response = await client.get(`/surat-masuk/${uuid}`);
            setLetter(response.data);
        } catch (error: any) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        fetchLetterDetail().then();
    }, [fetchLetterDetail]);

    if (isLoading || !user) return <Skeleton/>;
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

    const handleMarkAsDone = async () => {
        try {
            await client.put(`/surat-masuk/${uuid}/done`);
            setLetter(prev => prev ? {
                ...prev,
                user_status: {...prev.user_status, pelaksanaan_at: new Date().toISOString()}
            } : null);
            alert.success(text('message:letter_mark_success'));
            await fetchLetterDetail();
        } catch (error: any) {
            alert.warning(error.message || text('message:letter_mark_failed'));
        }
    };

    const checkIfUserInDispositionLogs = (disposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3 | null, userUuid: string): boolean => {
        if (!disposisi) {
            return letter.penerima.uuid === userUuid;
        }
        const isUserInLogs = disposisi.log_disposisis.some(log => log.penerima_user.uuid === userUuid);
        if (isUserInLogs) {
            return true;
        } else if ('disposisi_level2' in disposisi) {
            return disposisi.disposisi_level2.some(level2 =>
                checkIfUserInDispositionLogs(level2, userUuid)
            );
        } else if ('disposisi_level3' in disposisi) {
            return disposisi.disposisi_level3.some(level3 =>
                checkIfUserInDispositionLogs(level3, userUuid)
            );
        }
        return false;
    };

    const userHasDisposisi = checkIfUserHasDisposisi(letter.disposisi, user.uuid);
    const userCanDisposisi = checkIfUserInDispositionLogs(letter.disposisi, user.uuid);

    const handleDisposisiClick = (disposisi: Disposisi | null) => {
        setParentDisposisi(disposisi);
        setShowDisposisiModal(true);
    };

    const handleCloseDisposisiModal = async () => {
        setShowDisposisiModal(false);
        await fetchLetterDetail();
    };

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

                        <TextArea label={text('description')} value={letter.perihal} disabled={true} rows={3}/>
                        <Input label={text('send_by')} value={letter.pengirim} disabled={true}/>
                        <Input label={text('created_by')} value={letter.creator.name} disabled={true}/>
                        <Input label={text('date')} value={dateFormat(letter.tanggal_surat)} disabled={true}/>
                        <Input label={text('send_at')} value={dateFormat(letter.created_at)} disabled={true}/>

                        {user.role === "Pejabat" ? (
                            userHasDisposisi ? (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>{text('message:letter_has_been_disposed')}</p>
                                </div>
                            ) : userCanDisposisi ? (
                                <Button
                                    label={text('message:dispose_letter')}
                                    onClick={() => letter?.disposisi ? handleDisposisiClick(letter.disposisi) : handleDisposisiClick(null)}
                                />
                            ) : (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>{text('message:letter_not_related')}</p>
                                </div>
                            )
                        ) : user.role === "Tata Usaha" && letter.creator.uuid === user.uuid ? (
                            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                <p>{text('message:letter_has_been_created')}</p>
                            </div>
                        ) : user.role === "Pelaksana" ? (
                            letter.user_status.pelaksanaan_at ? (
                                <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                    <p>{text('message:marked_as_executed')}</p>
                                </div>
                            ) : (
                                <Button
                                    label={text('message:mark_as_executed')}
                                    onClick={handleMarkAsDone}
                                />
                            )
                        ) : (
                            <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                                <p>{text('message:letter_not_related')}</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <History letter={letter}/>

            {showDisposisiModal && (
                <DisposisiModal
                    onClose={handleCloseDisposisiModal}
                    letter={letter}
                    parentDisposisi={parentDisposisi}
                />
            )}
        </>
    );
};

export default withAuth(LetterInDetail, ["Tata Usaha", "Pejabat", "Pelaksana"]);
