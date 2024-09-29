import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import client from '@/api/client';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import Viewer from '@/components/common/Viewer';
import Skeleton from '@/components/common/Skeleton';
import Custom404 from '@/pages/404';
import {useDateFormatter} from "@/utils/useDateFormatter";
import {useTranslation} from "@/utils/useTranslation";

const DisposisiDetail: React.FC = () => {
    const router = useRouter();
    const {uuid} = router.query;
    const [disposition, setDisposition] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dateFormat = useDateFormatter();
    const text = useTranslation();

    const fetchDispositionDetails = useCallback(async () => {
        if (!uuid) return;
        try {
            setIsLoading(true);
            const response = await client.get(`/disposisi/${uuid}`);
            setDisposition(response.data);
        } catch (error: any) {
            console.error('Error fetching disposition:', error);
        } finally {
            setIsLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        fetchDispositionDetails().then();
    }, [fetchDispositionDetails]);

    if (isLoading) return <Skeleton />;
    if (!disposition) return <Custom404 />;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-6 mb-6">
                <section className="flex-1 border border-gray-300 rounded-lg dark:border-gray-600 w-full">
                    <Viewer file={disposition.tanda_tangan} />
                </section>
                <aside className="w-full lg:w-2/3 border border-gray-300 rounded-lg dark:border-gray-600 p-4 bg-white shadow-md dark:bg-gray-800 flex flex-col gap-2">
                    <Input label="Pembuat Disposisi" disabled={true} value={disposition?.creator?.name || 'N/A'} />
                    <Input label="Dibuat Pada" disabled={true} value={dateFormat(disposition.created_at)} />
                    <TextArea
                        rows={3}
                        label={text('disposition_content')}
                        disabled={true}
                        value={disposition?.isi_disposisis?.map((isi: any) => isi.isi_disposisi.isi).join(', ') || text('message:letter_content_disposition_not_found')}
                    />
                    <TextArea
                        rows={3}
                        label={text('note')}
                        disabled={true}
                        value={disposition?.catatan || text('letter_disposition_note_not_found')}
                    />
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{text('recipient')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {disposition?.log_disposisis?.map((recipient: any) => (
                                <span
                                    key={recipient.penerima_user.uuid}
                                    className="text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                                >
                                    {recipient.penerima_user.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DisposisiDetail;
