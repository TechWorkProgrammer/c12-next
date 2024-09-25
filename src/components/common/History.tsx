import React, {useEffect, useState} from 'react';
import {useDateFormatter} from '@/utils/useDateFormatter';
import Select from "@/components/forms/Select";
import StatusBadge from "@/components/badges/StatusBadge";
import {DetailLetterIn, Disposisi, DisposisiLevel2, DisposisiLevel3, LogDisposisi} from "@/interfaces/LetterIn";
import Viewer from '@/components/common/Viewer';
import TextArea from "@/components/forms/TextArea";
import Input from "@/components/forms/Input";
import {generateQRCode} from "@/utils/QRCode";
import DownloadButton from "@/components/badges/DownloadButton";
import DispositionPage from "@/components/common/DispositionPage";
import {createRoot} from "react-dom/client";
import {useLoader} from "@/contexts/LoadingContext";
import {useAlert} from "@/contexts/AlertContext";
import Modal from "@/components/common/Modal";

const History: React.FC<{ letter: DetailLetterIn }> = ({letter}) => {
    const {disposisi, creator, penerima, log_status} = letter;
    const [filterPerson, setFilterPerson] = useState('all');
    const [showRecipients, setShowRecipients] = useState<Record<string, boolean>>({});
    const [selectedDisposition, setSelectedDisposition] = useState<Disposisi | DisposisiLevel2 | DisposisiLevel3 | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const dateFormat = useDateFormatter();
    const loader = useLoader();
    const alert = useAlert();

    const generatePDF = async () => {
        if (selectedDisposition) {
            loader(true);
            try {
                const kopSuratUrl = '/default.png';
                const html2pdf = (await import('html2pdf.js')).default;
                const tempContainer = document.createElement('div');
                document.body.appendChild(tempContainer);

                const options = {
                    margin: 1,
                    filename: `${letter.nomor_surat + '-' + selectedDisposition?.creator.name || 'disposition'}.pdf`,
                    image: {type: 'jpeg', quality: 0.98},
                    html2canvas: {scale: 2, useCORS: true},
                    jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
                };

                const root = createRoot(tempContainer);
                root.render(
                    <DispositionPage
                        letter={letter}
                        disposition={selectedDisposition}
                        status={selectedLevel}
                        qrCodeUrl={qrCodeUrl}
                        date={dateFormat(selectedDisposition.created_at, 'id-ID')}
                        kopSuratUrl={kopSuratUrl}
                    />
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));

                await html2pdf().from(tempContainer).set(options).save();

                document.body.removeChild(tempContainer);
                alert.success('Generate PDF Success, check it on download menu');
            } catch (error: any) {
                alert.danger('Failed to generate PDF:', error);
            } finally {
                loader(false);
            }
        }
    };

    useEffect(() => {
        if (selectedDisposition) {
            generateQRCode(`https://sparti.online/letters/disposition?uuid=${selectedDisposition.uuid}`)
                .then((url) => setQrCodeUrl(url))
                .catch((error) => console.error("Failed to generate QR code:", error));
        }
    }, [selectedDisposition]);

    const toggleRecipients = (idx: string) => {
        setShowRecipients((prev) => ({
            ...prev,
            [idx]: !prev[idx],
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
            disposisi: null,
        },
        ...(disposisi ? gatherDispositions(disposisi).map(({level, disposisi}) => ({
            type: 'disposisi',
            date: disposisi.created_at,
            description: `${level} dibuat oleh ${disposisi.creator.name}, diterima oleh ${disposisi.log_disposisis.length} orang.`,
            level,
            disposisi,
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

    const groupByLevel = (actions: any[]) => {
        return actions.reduce((grouped, action) => {
            if (!grouped[action.level]) {
                grouped[action.level] = [];
            }
            grouped[action.level].push(action);
            return grouped;
        }, {} as Record<string, any[]>);
    };

    const groupedActions = groupByLevel(filteredActions);

    const handleStatusClick = (disposisi: Disposisi | DisposisiLevel2 | DisposisiLevel3, level: string) => {
        setSelectedDisposition(disposisi);
        setSelectedLevel(level);
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
                {(Object.entries(groupedActions) as [string, any[]][]).map(([level, actionsInGroup], index) => (
                    <li key={index} className="mb-6 ms-6">
                        <span
                            className="absolute -start-2.5 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-800">
                            <svg className="h-3 w-3 text-green-800 dark:text-green-300" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 11.917 9.724 16.5 19 7.5"/>
                            </svg>
                        </span>
                        <span
                            className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 dark:bg-blue-900 dark:text-green-100">
                            {level}
                        </span>
                        {actionsInGroup.map((action: any, idx: number) => {
                            const uniqueIdx = index + '-' + idx;
                            return (
                                <div key={uniqueIdx} className="mt-2">
                                    <p className="text-base lg:text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">
                                        {action.description}
                                    </p>
                                    <p className="text-sm text-gray-800 dark:text-gray-500">
                                        {dateFormat(action.date)}
                                    </p>
                                    <span
                                        onClick={() => toggleRecipients(uniqueIdx)}
                                        className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                    >
                                        Lihat Penerima
                                    </span>
                                    {action.disposisi && (
                                        <span
                                            onClick={() => handleStatusClick(action.disposisi, action.level)}
                                            className="text-sm px-2 text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                        >
                                            Lihat Surat Disposisi
                                        </span>
                                    )}
                                    {showRecipients[uniqueIdx] && (
                                        <ul className="ml-6 mt-2">
                                            {action.recipients.map((p: any) => {
                                                const {status, date} = getDispositionStatus(p.uuid);
                                                return (
                                                    <li key={p.uuid}
                                                        className="flex flex-col md:flex-row justify-start items-start md:items-center gap-2 mb-1">
                                                        <div className="flex flex-row justify-start items-center gap-2">
                                                            <StatusBadge status={status}/>
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
                                </div>
                            );
                        })}
                    </li>
                ))}
            </ol>

            {selectedDisposition && (
                <Modal
                    label="Detail Disposisi"
                    isOpen={!!selectedDisposition}
                    onClose={() => setSelectedDisposition(null)}
                >
                    <div className="max-h-[70vh] overflow-auto w-lvw min-w-80 max-w-lg">
                        <div className="space-y-4">
                            <div className="flex flex-row justify-between mb-2">
                                <StatusBadge status={selectedLevel}/>
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
                                value={selectedDisposition.isi_disposisis.map(isi => isi.isi_disposisi.isi).join(', ')}
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
