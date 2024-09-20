import React, {useEffect, useState} from 'react';
import {useDateFormatter} from '@/utils/useDateFormatter';
import Select from "@/components/forms/Select";
import StatusBadge from "@/components/badges/StatusBadge";
import {DetailLetterIn, Disposisi, DisposisiLevel2, DisposisiLevel3, LogDisposisi} from "@/interfaces/LetterIn";
import Modal from '@/components/common/Modal';
import Viewer from '@/components/common/Viewer';
import TextArea from "@/components/forms/TextArea";
import Input from "@/components/forms/Input";
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import {generateQRCode} from "@/utils/QRCode";
import {generateDispositionHTML} from "@/utils/generateDispositionHTML";
import DownloadButton from "@/components/badges/DownloadButton";

const History: React.FC<{ letter: DetailLetterIn }> = ({letter}) => {
    const {disposisi, creator, penerima, log_status} = letter;
    const [filterPerson, setFilterPerson] = useState('all');
    const [showRecipients, setShowRecipients] = useState<Record<string, boolean>>({});
    const [selectedDisposition, setSelectedDisposition] = useState<Disposisi | DisposisiLevel2 | DisposisiLevel3 | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const dateFormat = useDateFormatter();

    const generatePDF = async () => {
        if (selectedDisposition) {
            const htmlContent = generateDispositionHTML(letter, selectedDisposition, selectedStatus, qrCodeUrl);

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = htmlContent;
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
            });

            document.body.removeChild(tempContainer);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new JsPDF('p', 'mm', 'a4');
            const imgWidth = 210 - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`${selectedDisposition?.creator.name || 'disposition'}.pdf`);
        }
    };

    useEffect(() => {
        if (selectedDisposition) {
            generateQRCode(`https://sparti.online/letters/disposition?uuid=${selectedDisposition.uuid}`)
                .then((url) => setQrCodeUrl(url))
                .catch((error) => console.error("Failed to generate QR code:", error));
        }
    }, [selectedDisposition]);

    const toggleRecipients = (levelUuid: string) => {
        setShowRecipients((prev) => ({
            ...prev,
            [levelUuid]: !prev[levelUuid],
        }));
    };

    const getDispositionStatus = (userUuid: string) => {
        const userLog = log_status.find(log => log.user_id === userUuid);
        if (!userLog) return {status: 'Offline', date: null};

        if (userLog.pelaksanaan_at) return {status: 'Dilaksanakan', date: userLog.pelaksanaan_at};
        if (userLog.read_at) return {status: 'Dibaca', date: userLog.read_at};
        return {status: 'Belum Dibaca', date: userLog.created_at};
    };

    const extractRecipients = (logs: LogDisposisi[]) => logs.map(log => log.penerima_user);

    const gatherDispositions = (disposisi: Disposisi) => {
        const allDispositions: { level: string, disposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3 }[] = [];

        allDispositions.push({level: 'Disposisi 1', disposisi});

        disposisi.disposisi_level2.forEach(level2 => {
            allDispositions.push({level: 'Disposisi 2', disposisi: level2});

            level2.disposisi_level3.forEach(level3 => {
                allDispositions.push({level: 'Disposisi 3', disposisi: level3});
            });
        });

        return allDispositions;
    };

    const actions = [
        {
            type: 'pengiriman',
            date: letter.created_at,
            description: `${creator.name} mengirim surat kepada ${penerima.name}.`,
            level: 'Penurunan Surat',
            recipients: [penerima],
            dispoisi: [],
        },
        ...(disposisi ? gatherDispositions(disposisi).map(({level, disposisi}) => ({
            type: 'disposisi',
            date: disposisi.created_at,
            description: `${level} dibuat oleh ${disposisi.creator.name}, diterima oleh ${disposisi.log_disposisis.length} orang.`,
            level,
            recipients: extractRecipients(disposisi.log_disposisis),
        })) : []),
    ];

    const uniqueNames = Array.from(new Set(actions.flatMap((action) => action.recipients.map(p => p.name))));

    const selectOptions = [
        {label: 'Semua Orang', value: 'all'},
        ...uniqueNames.map((name) => ({label: name, value: name}))
    ];

    const filteredActions = filterPerson === 'all'
        ? actions
        : actions.filter(action => action.recipients.some(p => p.name === filterPerson));

    const handleStatusClick = (disposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3 | any, status: string) => {
        console.log(disposisi);
        setSelectedDisposition(disposisi);
        setSelectedStatus(status);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col gap-2 lg:flex-row justify-between items-center mx-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white w-full">Log Surat</h3>
                <Select
                    label="Filter Berdasarkan Penerima"
                    value={filterPerson}
                    options={selectOptions}
                    onChange={(value) => setFilterPerson(value)}
                />
            </div>
            <ol className="relative border-s border-gray-300 dark:border-gray-700 mx-2 lg:mx-8">
                {filteredActions.map((action, index) => (
                    <li key={index} className="mb-6 ms-6">
                        <span
                            className="absolute -start-2.5 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-800">
                            <svg className="h-3 w-3 text-green-800 dark:text-green-300" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                            </svg>
                        </span>
                        <span
                            className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 dark:bg-blue-900 dark:text-green-100">
                            {action.level}
                        </span>
                        <p className="text-base lg:text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">
                            {action.description}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-500">
                            {dateFormat(action.date)}
                        </p>
                        <span
                            onClick={() => toggleRecipients(action.level)}
                            className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            Lihat Penerima
                        </span>
                        {showRecipients[action.level] && (
                            <ul className="ml-6 mt-2">
                                {action.recipients.map((p) => {
                                    const {status, date} = getDispositionStatus(p.uuid);
                                    return (
                                        <li key={p.uuid}
                                            className="flex flex-col md:flex-row justify-start items-start md:items-center gap-2 mb-1">
                                            <div className="flex flex-row justify-start items-center gap-2">
                                                <StatusBadge
                                                    status={status}
                                                    onClick={() => handleStatusClick(action, status)}
                                                />
                                                <span className="text-sm text-gray-800 dark:text-gray-300">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-300">
                                               {date && dateFormat(date)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                ))}
            </ol>

            {selectedDisposition && (
                <Modal
                    label="Detail Disposisi"
                    isOpen={!!selectedDisposition}
                    onClose={() => setSelectedDisposition(null)}
                >
                    <div className="max-h-[70vh] overflow-auto min-w-96">
                        <div className="space-y-4">
                            <div className="flex flex-row justify-between mb-2">
                                <StatusBadge status={selectedStatus}/>
                                <DownloadButton fileUrl={''} fileName={''} onGeneratePDF={generatePDF}/>
                            </div>
                            <Input
                                label="No Surat"
                                disabled={true}
                                value={letter.nomor_surat}
                            />
                            <Input
                                label="Pembuat Disposisi"
                                disabled={true}
                                value={selectedDisposition.creator.name}
                            />
                            <TextArea
                                rows={3}
                                label="Catatan"
                                disabled={true}
                                value={selectedDisposition.catatan}
                            />
                            <TextArea
                                rows={3}
                                label="Isi Disposisi"
                                disabled={true}
                                value={selectedDisposition.isi_disposisi.map(isi => isi.isi).join(', ')}
                            />
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Penerima:
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                    {selectedDisposition.log_disposisis.map((recipient) => (
                                        <span
                                            key={recipient.penerima_user.uuid}
                                            className="text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                                        >
                                            {recipient.penerima_user.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4 mt-4">
                                <Viewer file={qrCodeUrl}/>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default History;
