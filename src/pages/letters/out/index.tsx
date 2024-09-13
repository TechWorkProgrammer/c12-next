import React, { useEffect, useState } from 'react';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Pagination from '@/components/Pagination';
import data from '@/data/lettersOut.json';
import Datepicker from "@/components/forms/Datepicker";
import { dateFormatter } from "@/utils/dateFormatter";
import ClassificationBadge from "@/components/badges/ClassificationBadge";
import StatusBadge from "@/components/badges/StatusBadge";
import DownloadButton from "@/components/badges/DownloadButton";
import FileDisplay from "@/components/badges/FileDisplay";
import Filter from "@/components/forms/Filter";
import Link from "next/link";
import FloatingButton from "@/components/common/FloatingButton";
import { useRouter } from "next/router";
import { getCurrentUser } from '@/storage/userStorage';
import { LetterOut } from '@/interfaces/LetterOut';

const classificationOptions = [
    { label: 'Semua', value: '' },
    { label: 'Rahasia', value: 'rahasia' },
    { label: 'Biasa', value: 'biasa' },
    { label: 'Segera', value: 'segera' },
];

const statusOptions = [
    { label: 'Semua', value: '' },
    { label: 'Waiting', value: 'waiting' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Accepted', value: 'accepted' },
];

const LettersOut: React.FC = () => {
    const [search, setSearch] = useState('');
    const [classification, setClassification] = useState('');
    const [status, setStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState<LetterOut[]>(data);
    const [sortOrder, setSortOrder] = useState('default');
    const router = useRouter();

    const handleCreate = () => {
        router.push('/letters/out/create').then();
    };

    const currentUser = getCurrentUser();
    const userUuid = currentUser ? currentUser.uuid : '';

    useEffect(() => {
        let sortedData = [...data];

        switch (sortOrder) {
            case 'name-asc':
                sortedData.sort((a, b) => a.file_surat.localeCompare(b.file_surat));
                break;
            case 'name-desc':
                sortedData.sort((a, b) => b.file_surat.localeCompare(a.file_surat));
                break;
            case 'date-asc':
                sortedData.sort((a, b) => new Date(a.tanggal_surat).getTime() - new Date(b.tanggal_surat).getTime());
                break;
            case 'date-desc':
                sortedData.sort((a, b) => new Date(b.tanggal_surat).getTime() - new Date(a.tanggal_surat).getTime());
                break;
            default:
                sortedData = [...data];
        }

        const filtered = sortedData.filter((item) => {
            const isDateMatch = selectedDate ? new Date(item.tanggal_surat).toISOString().slice(0, 10) === selectedDate : true;

            return (
                (item.perihal.toLowerCase().includes(search.toLowerCase()) ||
                    item.created_by.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.penerima.name.toLowerCase().includes(search.toLowerCase())) &&
                (classification ? item.klasifikasi_surat.name === classification : true) &&
                (status ? item.status === status : true) &&
                isDateMatch
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [search, classification, status, selectedDate, sortOrder, userUuid]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="antialiased">
            <FloatingButton onClick={handleCreate} />
            <div className="max-w-screen-xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Surat Keluar</h1>
                <div className="gap-2 flex lg:flex-row flex-col items-center justify-between">
                    <div className="w-full">
                        <Input
                            label="Pencarian"
                            id="search"
                            type="text"
                            placeholder="Cari berdasarkan perihal, nama pengirim, atau penerima"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 items-end justify-between w-full">
                        <div className="w-full flex flex-row gap-2">
                            <Select
                                label='Klasifikasi'
                                value={classification}
                                options={classificationOptions}
                                onChange={setClassification}
                            />

                            <Select
                                label='Status'
                                value={status}
                                options={statusOptions}
                                onChange={setStatus}
                            />
                        </div>
                        <div className="w-full flex flex-row gap-2 items-end">
                            <Datepicker
                                label='Tanggal'
                                onChange={(date) => setSelectedDate(date)}
                            />

                            <Filter onSelect={setSortOrder} />
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <Link href={`/letters/out/detail?uuid=${item.uuid}`} key={item.uuid}>
                                <article
                                    className="mb-4 px-2 pt-2 pb-2 lg:px-6 lg:pt-4 lg:pb-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex justify-start gap-2 items-start text-gray-500">
                                            <ClassificationBadge classification={item.klasifikasi_surat.name} />
                                            <StatusBadge status={item.status} />
                                        </div>
                                        <DownloadButton fileName={item.file_surat} fileUrl={item.file_surat} />
                                    </div>
                                    <FileDisplay fileName={item.file_surat} label={item.perihal} />
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs text-gray-500 dark:text-gray-500">{item.created_by.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-500">{dateFormatter(item.tanggal_surat)}</span>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Tidak ada data yang sesuai.</p>
                    )}
                </div>

                <Pagination
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </section>
    );
};

export default LettersOut;
