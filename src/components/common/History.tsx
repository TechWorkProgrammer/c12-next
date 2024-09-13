import React, {useEffect, useRef, useState} from 'react';
import {dateFormatter} from '@/utils/dateFormatter';
import Select from "@/components/forms/Select";
import StatusBadge from "@/components/badges/StatusBadge";
import {Disposisi, LetterIn} from "@/interfaces/LetterIn";
import Modal from '@/components/common/Modal';
import Viewer from '@/components/common/Viewer';
import TextArea from "@/components/forms/TextArea";
import Input from "@/components/forms/Input";
import DownloadButton from "@/components/badges/DownloadButton";
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import QRCode from 'qrcode';

const History: React.FC<{ letter: LetterIn }> = ({letter}) => {
    const {disposisi, pengirim, penerima} = letter;
    const [filterPerson, setFilterPerson] = useState('all');
    const [showRecipients, setShowRecipients] = useState<Record<string, boolean>>({});
    const [selectedDisposition, setSelectedDisposition] = useState<Disposisi | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const modalRef = useRef<HTMLDivElement | null>(null);

    const generatePDF = async () => {
        if (modalRef.current instanceof HTMLDivElement) {
            const canvas = await html2canvas(modalRef.current, {
                windowWidth: document.body.scrollWidth,
                windowHeight: document.body.scrollHeight,
                scrollX: 0,
                scrollY: 0,
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new JsPDF('p', 'mm', 'a4');
            const imgWidth = 210 - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`${selectedDisposition?.created_by.name || 'disposition'}.pdf`);
        }
    };

    const generateQRCode = async (value: string) => {
        try {
            const url = await QRCode.toDataURL(value, {width: 200, margin: 2});
            setQrCodeUrl(url);
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    useEffect(() => {
        if (selectedDisposition) {
            generateQRCode(`https://sparti.online/letters/disposition?uuid=${selectedDisposition.uuid}`).then();
        }
    }, [selectedDisposition]);

    const toggleRecipients = (levelUuid: string) => {
        setShowRecipients((prev) => ({
            ...prev,
            [levelUuid]: !prev[levelUuid],
        }));
    };

    const groupDispositionsByLevel = (dispositions: Disposisi[]) => {
        const level1 = dispositions.filter(d => !d.disposisi_asal);
        const level2 = dispositions.filter(d => level1.some(l1 => l1.uuid === d.disposisi_asal?.uuid));
        const level3 = dispositions.filter(d => level2.some(l2 => l2.uuid === d.disposisi_asal?.uuid));
        return {level1, level2, level3};
    };

    const {level1, level2, level3} = groupDispositionsByLevel(disposisi);

    const actions = [
        {
            type: 'pengiriman',
            date: letter.created_at,
            description: `${pengirim.name} mengirim surat kepada ${penerima.name}.`,
            level: 'Penurunan Surat',
            disposisi: {
                uuid: '',
                penerima: [penerima]
            },
        },
        ...level1.map(d => ({
            type: 'disposisi',
            date: d.created_at,
            description: `Disposisi Level 1 dibuat oleh ${d.created_by.name}, diterima oleh ${d.penerima.length} orang.`,
            level: 'Disposisi 1',
            disposisi: d,
        })),
        ...level2.map(d => ({
            type: 'disposisi',
            date: d.created_at,
            description: `Disposisi Level 2 dibuat oleh ${d.created_by.name}, diterima oleh ${d.penerima.length} orang.`,
            level: 'Disposisi 2',
            disposisi: d,
        })),
        ...level3.map(d => ({
            type: 'disposisi',
            date: d.created_at,
            description: `Disposisi Level 3 dibuat oleh ${d.created_by.name}, diterima oleh ${d.penerima.length} orang.`,
            level: 'Disposisi 3',
            disposisi: d,
        })),
    ];

    const uniqueNames = Array.from(new Set(actions.flatMap((action) => action.disposisi.penerima.map(p => p.name))));

    const selectOptions = [
        {label: 'Semua Orang', value: 'all'},
        ...uniqueNames.map((name) => ({label: name, value: name}))
    ];

    const getHighestDispositionLevel = (recipientUuid: string): {
        highestLevel: string;
        date: string | null,
        disposition: Disposisi | null
    } => {
        const level3Disposition = level3.find(d => d.created_by.uuid === recipientUuid);
        if (level3Disposition) return {
            highestLevel: 'Disposisi 3',
            date: level3Disposition.created_at,
            disposition: level3Disposition
        };

        const level2Disposition = level2.find(d => d.created_by.uuid === recipientUuid);
        if (level2Disposition) return {
            highestLevel: 'Disposisi 2',
            date: level2Disposition.created_at,
            disposition: level2Disposition
        };

        const level1Disposition = level1.find(d => d.created_by.uuid === recipientUuid);
        if (level1Disposition) return {
            highestLevel: 'Disposisi 1',
            date: level1Disposition.created_at,
            disposition: level1Disposition
        };

        return {highestLevel: 'Belum Dibaca', date: null, disposition: null};
    };

    const getDispositionStatus = (recipient: any) => {
        const {highestLevel, date, disposition} = getHighestDispositionLevel(recipient.uuid);
        if (highestLevel !== 'Belum Dibaca') return {status: highestLevel, date: date, disposition: disposition};
        if (recipient.pelaksanaan_at) return {
            status: 'Dilaksanakan',
            date: recipient.pelaksanaan_at,
            disposition: null
        };
        if (recipient.read_at) return {status: 'Dibaca', date: recipient.read_at, disposition: null};
        return {status: 'Belum Dibaca', date: null, disposition: null};
    };

    const filteredActions = filterPerson === 'all'
        ? actions
        : actions.filter(action => action.disposisi.penerima.some(p => p.name === filterPerson));

    const handleStatusClick = (disposisi: Disposisi | any, status: string) => {
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
                            className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-blue-900 dark:text-green-100">
                            {action.level}
                        </span>
                        <p className="text-base lg:text-sm font-semibold text-gray-800 dark:text-gray-300 mt-1">
                            {action.description}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-500">
                            {dateFormatter(action.date)}
                        </p>
                        <span
                            onClick={() => toggleRecipients(action.disposisi.uuid)}
                            className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            Lihat Penerima
                        </span>
                        {showRecipients[action.disposisi.uuid] && (
                            <ul className="ml-6 mt-2">
                                {action.disposisi.penerima.map((p) => {
                                    const {status, date, disposition} = getDispositionStatus(p);
                                    return (
                                        <li key={p.uuid} className="flex items-center gap-2 mb-1">
                                            <StatusBadge
                                                status={status}
                                                onClick={() => disposition && handleStatusClick(disposition, status)}
                                            />
                                            <span className="text-sm text-gray-800 dark:text-gray-300">
                                                {p.name} {date ? '- ' + dateFormatter(date) : ''}
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
                    <div ref={modalRef} className="max-h-[70vh] overflow-auto min-w-96">
                        <div className="space-y-2">
                            <div className="flex flex-row justify-between mb-2">
                                <StatusBadge status={selectedStatus}/>
                                <DownloadButton fileUrl={''} fileName={''} onGeneratePDF={generatePDF}/>
                            </div>
                            <Input
                                label="No Surat"
                                disabled={true}
                                value={letter.no_surat}
                            />
                            <Input
                                label="Pembuat Disposisi"
                                disabled={true}
                                value={selectedDisposition.created_by.name}
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
                                value={selectedDisposition.isi.map(isi => isi.isi).join(', ')}
                            />
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Penerima:
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                    {selectedDisposition.penerima.map((recipient) => (
                                        <span
                                            key={recipient.uuid}
                                            className="text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                                        >
                                            {recipient.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {selectedDisposition.tanda_tangan && (
                                <div
                                    className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 mt-4">
                                    <Viewer file={qrCodeUrl}/>
                                    <Viewer file={selectedDisposition.tanda_tangan}/>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default History;
