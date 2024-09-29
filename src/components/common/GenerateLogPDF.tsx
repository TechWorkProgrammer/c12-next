import React from 'react';
import DownloadButton from '@/components/badges/DownloadButton';
import client from '@/api/client';
import { useLoader } from "@/contexts/LoadingContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "@/utils/useTranslation";
import { useDateFormatter } from '@/utils/useDateFormatter';
import { Log, DispositionLog } from "@/interfaces/Log";


interface GenerateLogPDFProps {
    userName:string;
    userUUID: string;
    month?: string;
    year: string;
}

const GenerateLogPDF: React.FC<GenerateLogPDFProps> = ({ userName,userUUID, month, year }) => {
    const loader = useLoader();
    const alert = useAlert();
    const text = useTranslation();
    const dateFormat = useDateFormatter();

    const generatePDF = async () => {
        loader(true);

        if (!userUUID || !year) {
            loader(false);
            alert.danger(text('message:missing_required_parameters'));
            return;
        }

        const formData = new FormData();
        formData.append('tahun', year);
        if (month) {
            formData.append('bulan', month);
        }

        try {
            const response = await client.post(`/surat-masuk/log/user/${userUUID}`, formData);

            if (!response) {
                loader(false);
                alert.danger(text('message:no_data_available'));
                return;
            }

            const { data } = response;
            const { status_user, disposisi } = data as { status_user: Log[]; disposisi: DispositionLog[] };

            const combinedLogs = [
                ...status_user.map((status) => ({
                    date: status.created_at || '',
                    content: status.surat_masuk ? `<p>${dateFormat(status.created_at)}: ${text('received_letter')} ${status.surat_masuk.nomor_surat}</p>` : ''
                })),
                ...status_user.flatMap((status) => [
                    status.read_at ? {
                        date: status.read_at,
                        content: `<p>${dateFormat(status.read_at)}: ${text('read_letter')} ${status.surat_masuk.nomor_surat}</p>`
                    } : null,
                    status.pelaksanaan_at ? {
                        date: status.pelaksanaan_at,
                        content: `<p>${dateFormat(status.pelaksanaan_at)}: ${text('executed_letter')} ${status.surat_masuk.nomor_surat}</p>`
                    } : null,
                ]).filter((log): log is { date: string; content: string } => log !== null),
                ...disposisi.map((disposisiEntry) => {
                    const relatedSurat = status_user.find((status) => status.surat_masuk_id === disposisiEntry.surat_id);
                    return {
                        date: disposisiEntry.created_at || '',
                        content: relatedSurat ? `<p>${dateFormat(disposisiEntry.created_at)}: ${text('made_disposition_on_letter')} ${relatedSurat.surat_masuk.nomor_surat}</p>` : ''
                    };
                })
            ].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateA - dateB;
            });

            let logEntries = combinedLogs.map(log => log.content).join('');

            const html2pdf = (await import('html2pdf.js')).default;
            const tempContainer = document.createElement('div');
            document.body.appendChild(tempContainer);

            tempContainer.innerHTML = `<main style="padding-top: 0; padding-bottom: 10px;">${logEntries}</main>`;

            const monthName = `_${month ? text('month_string:' + month) : ''}`;

            const options = {
                margin: 1,
                filename: `Log_${userName}${monthName}_${year}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            await html2pdf().from(tempContainer).set(options).save();

            document.body.removeChild(tempContainer);
            alert.success(text('message:pdf_generate_success'));
        } catch (error: any) {
            alert.danger(error.message || text('message:pdf_generate_failed'));
        } finally {
            loader(false);
        }
    };

    return (
        <DownloadButton
            label={true}
            fileUrl=""
            fileName="report.pdf"
            onGeneratePDF={generatePDF}
        />
    );
};

export default GenerateLogPDF;
